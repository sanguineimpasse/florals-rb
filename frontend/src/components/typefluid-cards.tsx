import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from "./ui/input";

type CardProps = {
  id: string,
  title: string;
  type: string;
  optional: boolean;
  choices?: string[];
  limit?: number;
  notValidReason?: string,
  onInputChange?: (value: string) => void;
}

//card types: textbox, number textbox, radio

function TypefluidCards({
  id,
  title,
  type,
  optional,
  choices,
  limit,
  notValidReason,
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
      <Card className="w-full gap-3">
        <CardHeader>
          <CardTitle>
            {title}{!optional && ' *'}
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
                return (
                  <div key={`${id}-choice-${index}`} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice} id={`${id}-choice-${index}`}/>
                    <Label htmlFor={`${id}-choice-${index}`}>{choice}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          }
        </CardContent>
        {notValidReason && 
          <CardFooter>
            <p className="text-destructive text-sm">{notValidReason}</p>
          </CardFooter>
        }
      </Card>
  )
}

export default TypefluidCards;