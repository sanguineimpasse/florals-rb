import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {


  const handleNewMessage = () => {
    window.alert("Not Implemented yet hehe")
  };
  return(
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center h-full w-full p-4 gap-2">
      {/* col1 */}
      <div className="flex flex-col items-left">
        <Card className="w-sm md:w-sm lg:w-lg min-h-3xl">
          <CardHeader>
            <CardTitle>
              Message Board
            </CardTitle>
            <CardDescription>
              Messages from admins
            </CardDescription>
            <CardAction>
              <Button variant="outline" onClick={handleNewMessage}>
                Add New Message
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm">No new messages for now...</p>
          </CardContent>
        </Card>
      </div>
      {/* col2 */}
      <div className="flex flex-col items-left justify-center gap-2">
        <div className="flex h-[50%]">
          <Card className="w-sm md:w-md lg:w-lg">
            <CardHeader>
              <CardTitle>
                Surveys
              </CardTitle>
              <CardDescription>
                View all the surveys and their responses here
              </CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
        </div>
        <div className="flex h-[50%]">
          <Card className="w-sm md:w-md lg:w-lg">
            <CardHeader>
              <CardTitle>
                Recent Responses
              </CardTitle>
              <CardDescription>
                View an individual response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This feature is not implemented yet...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
};

export default DashboardPage;