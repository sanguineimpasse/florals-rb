import React from "react";
import { useParams } from "react-router";
import axios, { AxiosResponse } from "axios";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner"
import ResponseChart from "@/components/responsechart";
import ClusterScatterChart from "@/components/ClusterChart";
import CorrelationChart from "@/components/CorrelationChart";

import Survey from "@/types/survey_format";
import nut_survey from "@/data/nutrition_survey.json";

const ResponsesPage = () => {
  const params = useParams();

  const [idIsValid, setIdIsValid] = React.useState(false);
  const [viewIsLoading, setViewIsLoading] = React.useState<boolean>(true);
  const [survey, setSurvey] = React.useState<Survey | null>(null);

  React.useEffect(() => {
    if (params.id === '230724') {
      setSurvey(nut_survey);
      setIdIsValid(true);
    }
    setViewIsLoading(false);
  }, [params]);

  const [tallyShown, setTallyShown] = React.useState(false);
  const [tallyLoading, setTallyLoading] = React.useState(true);
  const [retrievalFailed, setRetrievalFailed] = React.useState(false);
  const [retrievalError, setRetrievalError] = React.useState<any>();
  const [tallyData, setTallyData] = React.useState<any>();

  const [nutritionShown, setNutritionShown] = React.useState(false);
  const [nutritionLoading, setNutritionLoading] = React.useState(false);
  const [nutritionData, setNutritionData] = React.useState<any>();
  const [nutritionError, setNutritionError] = React.useState<any>();
  const [nutritionFailed, setNutritionFailed] = React.useState(false);

  const [rawShown, setRawShown] = React.useState(false);
  const [rawData, setRawData] = React.useState<any[]>([]);
  const [clusterLoading, setClusterLoading] = React.useState(false);

  const [correlationData, setCorrelationData] = React.useState<any[]>([]);
  const [correlationLoading, setCorrelationLoading] = React.useState(false);
  const [correlationShown, setCorrelationShown] = React.useState(false);

  //const [debugShowData, setDebugShowData] = React.useState(false);

  const cardClasses = "w-full md:w-lg";

  const convertTo2D = (clusteredData: any[]) => {
    return clusteredData.map(({ data }) => {
      const values = Object.values(data).map(Number);
      const x = values.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
      const y = values.slice(10).reduce((a, b) => a + b, 0) / 10;
      return { x, y, answerAvg: (x + y) / 2 };
    });
  };

  async function handleCorrelationAnalysis() {
    setCorrelationLoading(true);
    setCorrelationShown(true);
    setTallyShown(false);
    setNutritionShown(false);
    setRawShown(false);

    let apiAddress = '/api/data/get-raw-answers';
    if (import.meta.env.DEV) {
      apiAddress = 'http://localhost:4000/api/data/get-raw-answers';
    }

    try {
      const response: AxiosResponse<any[]> = await axios.get(apiAddress, { withCredentials: true });

      const cleaned = response.data.filter(d =>
        Object.values(d).every(v => typeof v === 'number' && Number.isFinite(v))
      );

      const correlations = cleaned.map((entry, index) => {
        const values = Object.values(entry).map(Number);
        const phys = values.slice(0, 10);
        const nut = values.slice(10, 20);
        const value = computePearsonCorrelation(phys, nut);
        return { respondent: `Respondent #${index + 1}`, value };
      });

      setCorrelationData(correlations);
    } catch (err) {
      console.error("Correlation error:", err);
    } finally {
      setCorrelationLoading(false);
    }
  }

  function computePearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const avgX = x.reduce((a, b) => a + b, 0) / n;
    const avgY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0, denomX = 0, denomY = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - avgX;
      const dy = y[i] - avgY;
      numerator += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }
    return numerator / Math.sqrt(denomX * denomY);
  }

  async function handleRawDataRet() {
    setClusterLoading(true);
    setRawShown(true);
    setTallyShown(false);
    setNutritionShown(false);

    let apiAddress = `/api/data/get-raw-answers`;
    if (import.meta.env.DEV) {
      apiAddress = 'http://localhost:4000/api/data/get-raw-answers';
    }

    try {
      const response: AxiosResponse<any[]> = await axios.get(apiAddress, { withCredentials: true });

      const cleaned = response.data.filter(d =>
        Object.values(d).every(v => typeof v === 'number')
      );

      const vectors = cleaned.map(obj =>
        Object.values(obj).map(Number)
      );
      const { assignments } = kMeans(vectors, 3);
      const clusteredData = cleaned.map((entry, i) => ({
        cluster: assignments[i],
        data: entry,
      }));
      setRawData(clusteredData);
    } catch (err) {
      console.error("Raw data error:", err);
    } finally {
      setClusterLoading(false);
    }
  }

  function kMeans(data: number[][], k: number, maxIterations = 100) {
    const centroids = data.slice(0, k).map(vec => [...vec]);
    let assignments: number[] = [];

    for (let iter = 0; iter < maxIterations; iter++) {
      assignments = data.map(point => {
        let best = 0, bestDist = Infinity;
        centroids.forEach((c, i) => {
          const dist = euclideanDistance(point, c);
          if (dist < bestDist) {
            best = i; bestDist = dist;
          }
        });
        return best;
      });

      const newCentroids = Array.from({ length: k }, () => Array(data[0].length).fill(0));
      const counts = Array(k).fill(0);

      data.forEach((point, i) => {
        const cluster = assignments[i];
        counts[cluster]++;
        point.forEach((v, j) => newCentroids[cluster][j] += v);
      });

      newCentroids.forEach((centroid, i) => {
        if (counts[i] > 0) centroid.forEach((_, j) => centroid[j] /= counts[i]);
      });

      centroids.splice(0, centroids.length, ...newCentroids);
    }
    return { assignments, centroids };
  }

  function euclideanDistance(a: number[], b: number[]) {
    return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
  }

  async function handleNutritionRet() {
    setNutritionShown(true);
    setNutritionLoading(true);
    setNutritionFailed(false);
    setNutritionError(null);

    let apiAddress = `/api/data/get-nutrition-responses`;
    if (import.meta.env.DEV) {
      apiAddress = 'http://localhost:4000/api/data/get-nutrition-responses';
    }

    try {
      const response: AxiosResponse<any> = await axios.get(apiAddress, { withCredentials: true });
      setNutritionData(response.data);
    } catch (err) {
      setNutritionFailed(true);
      if (axios.isAxiosError(err)) {
        setNutritionError("Axios error: " + err.message);
      } else {
        setNutritionError("Unexpected error: " + err);
      }
    } finally {
      setNutritionLoading(false);
    }
  }

  function handleFormRet() {
    setTallyShown(true);
    queryDB();
  }

  async function queryDB() {
    let apiAddress = `/api/data/get-responses`;
    if (import.meta.env.DEV) {
      apiAddress = 'http://localhost:4000/api/data/get-responses';
    }

    try {
      const response = await axios.get(apiAddress, { withCredentials: true });
      setTallyData(response.data);
    } catch (err) {
      setRetrievalFailed(true);
      setRetrievalError(axios.isAxiosError(err) ? err.message : String(err));
    } finally {
      setTallyLoading(false);
    }
  }

  return (
    <>
      {idIsValid ? (
        <div className="flex flex-col justify-center w-screen p-5 gap-2">
          <h1 className="text-2xl mb-4">
            Viewing responses for <span className="font-bold">Nutrition Survey</span>
          </h1>

          {!retrievalFailed ? (
            <>
              {!tallyShown && !nutritionShown && !rawShown && !correlationShown && (
                <>
                  <Card className="w-md">
                    <CardContent>
                      {"Note from admin: PLEASE WAG PO KUHA NANG KUHA NG RESPONSES MULA SA DB. MAPUPUNO PO YUNG QUOTA KO SA MONGODB 😭"}
                    </CardContent>
                  </Card>
                  <Card className="w-md">
                    <CardContent>
                      Display all the responses to the survey.
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" onClick={handleFormRet}>
                        Display form responses
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-md">
                    <CardContent>
                      Loads only the Nutrition section to save bandwidth.
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" onClick={handleNutritionRet}>
                        Display only Nutrition responses
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-md">
                    <CardContent>
                      Analyze correlation between physical and nutrition data.
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" onClick={handleCorrelationAnalysis}>
                        Run Correlation Analysis
                      </Button>
                    </CardFooter>
                  </Card>
                  <Card className="w-md">
                    <CardContent>
                      Perform cluster analysis to identify respondent groups.
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" onClick={handleRawDataRet}>
                        Run Cluster Analysis
                      </Button>
                    </CardFooter>
                  </Card>
                </>
              )}

              {tallyShown && !tallyLoading && tallyData && (
                <>
                  <Card className={cardClasses}>
                    <CardContent>
                      Total responses: <span className="font-bold">{tallyData["total_responses"]}</span>
                    </CardContent>
                  </Card>
                  {survey?.details_field.fields.map(field => (
                    <Card key={field.id} className={cardClasses}>
                      <CardHeader>
                        <CardTitle>{field.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {tallyData[`details_field.${field.id}`] && (
                          <ResponseChart
                            rawData={tallyData[`details_field.${field.id}`]}
                            type="detfield"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {correlationShown && (
                <Card className="w-[900px] h-[650px]">
                  <CardHeader>
                    <CardTitle>Correlation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col">
                    {correlationLoading ? (
                      <div className="flex flex-col items-center justify-center mt-4">
                        <Spinner className="w-10 h-10 mb-2" />
                        <p className="text-muted-foreground text-sm">Analyzing correlation...</p>
                      </div>
                    ) : (
                      <CorrelationChart data={correlationData} />
                    )}
                  </CardContent>
                </Card>
              )}

              {rawShown && (
                clusterLoading ? (
                  <div className="flex flex-col items-center justify-center mt-5">
                    <Spinner className="w-10 h-10 mb-2" />
                    <p className="text-sm text-muted-foreground">Analyzing clusters...</p>
                  </div>
                ) : (
                  <Card className="w-[900px] h-[700px]">
                    <CardHeader>
                      <CardTitle>Cluster Distribution (2D)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-full p-0">
                      <ClusterScatterChart data={convertTo2D(rawData)} />
                    </CardContent>
                  </Card>
                )
              )}

              {nutritionShown && (
                nutritionLoading ? (
                  <div>
                    <h1 className="mb-3">Loading nutrition responses...</h1>
                    <Spinner className="w-10 h-10" />
                  </div>
                ) : nutritionFailed ? (
                  <Card className="w-md mt-4">
                    <CardContent>
                      <h1 className="text-destructive">Nutrition Retrieval Error</h1>
                      <p className="text-destructive">{nutritionError}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Card className={cardClasses}>
                      <CardContent>
                        Total responses: <span className="font-bold">{nutritionData["total_responses"]}</span>
                      </CardContent>
                    </Card>

                    {survey?.pages.find(p => p.title.includes("Nutrition"))?.questions.map(question => (
                      <Card key={question.id} className={cardClasses}>
                        <CardHeader>
                          <CardTitle>{question.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {nutritionData[`survey_responses.${question.id}`] && (
                            <ResponseChart
                              rawData={nutritionData[`survey_responses.${question.id}`]}
                              type="survresponses"
                            />
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )
              )}
            </>
          ) : (
            <Card className="w-md mt-4">
              <CardHeader>
                <CardTitle>
                  <h1 className="text-destructive">Retrieval Error</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive">{retrievalError}</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        viewIsLoading && (
          <div className="p-10">
            <h1 className="text-3xl text-destructive font-bold">Unable to show responses</h1>
            <p className="mt-2">Survey Not Found</p>
          </div>
        )
      )}
    </>
  );
};

export default ResponsesPage;
