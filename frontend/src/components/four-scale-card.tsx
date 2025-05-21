import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type CardProps = {
  question: string;
  value: string;
  onRadioChange?: (value: string) => void;
}

function FourScaleCard({
  question,
  value,
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
            <RadioGroupItem value="4" id="option-one"/>
            <Label htmlFor="option-one"> Always </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="option-two"/>
            <Label htmlFor="option-two"> Often</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="option-three"/>
            <Label htmlFor="option-three"> Seldom </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="option-four"/>
            <Label htmlFor="option-four"> Never </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
};

export default FourScaleCard;