import { mock } from "node:test";
import { FormCard } from "./components/FormCard";

export default function GenerateCoursePage() {

  const mockQuestion: string = "Since you’ve already mastered Java, would it be helpful if I incorporated parallels to Java while I teach you React?";

  const mockOptions: string[] = [
    "Yes",
    "No",
    "Lmao",
  ];

  return (
    <div className="min-h-screen flex justify-center items-center">
      <FormCard question={mockQuestion} options={mockOptions} />
    </div>
  );

}