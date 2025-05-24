import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type CardProps = {
  id: string,
  question: string;
  value: string;
  notValidReason: string,
  onRadioChange?: (value: string) => void;
}

function FourScaleCard({
  id,
  question,
  value,
  notValidReason,
  onRadioChange
}: CardProps){

  return(
    <Card className='w-full gap-3'>
      <CardHeader>
        <CardTitle className='leading-5'>
          {question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 4 is highest, 1 is lowest */}
        <RadioGroup value={value} onValueChange={onRadioChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id={`${id}_4`}/>
            <Label htmlFor={`${id}_4`}> Always </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id={`${id}_3`}/>
            <Label htmlFor={`${id}_3`}> Often</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id={`${id}_2`}/>
            <Label htmlFor={`${id}_2`}> Seldom </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id={`${id}_1`}/>
            <Label htmlFor={`${id}_1`}> Never </Label>
          </div>
        </RadioGroup>
      </CardContent>
      { (notValidReason && notValidReason != '') && 
        <CardFooter>
          <p className="text-destructive text-sm">{notValidReason}</p>
        </CardFooter>
      }
    </Card>
  )
};

export default FourScaleCard;