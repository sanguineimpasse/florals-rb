import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from './ui/card';
import { Input } from "./ui/input";

type CardProps = {
  title: string;
  type: string;
  optional: boolean;
  choices?: string[];
  limit?: number;
  onInputChange?: (value: string) => void;
}

//card types: textbox, number textbox, radio

function TypefluidCards({
  title,
  type,
  optional,
  choices,
  limit,
  onInputChange
}: CardProps){

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const toString = String(value);

    if (onInputChange) {
      onInputChange(toString);
    }
  };

  return(
      <Card className='w-full gap-3'>
        <CardHeader>
          <CardTitle>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          { type === "textbox" &&
            <Input type="text" name={title} placeholder={title} onChange={handleChange}/>
          }
          { type === "number" &&
            <Input type="number" placeholder={title} onChange={handleChange} min={1} max={limit}/>
          }
          { (type === "radio" && choices) &&
            <RadioGroup onValueChange={onInputChange}>
              {choices.map((choice, index) => {
                const id = `choice-${index}`;
                return (
                  <div key={id} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice} id={id}/>
                    <Label htmlFor={id}>{choice}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          }
        </CardContent>
      </Card>
  )
}

export default TypefluidCards;