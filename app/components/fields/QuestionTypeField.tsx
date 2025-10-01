import { useFieldArray } from "react-hook-form";
import Button from "../shared/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import RadioField from "./RadioField";
import TextField from "./TextField";

interface FieldProps {
  control: any;
  errors: Record<string, any>;
  questionIndex: number;
}

export const MultipleChoiceField = ({
  control,
  errors,
  questionIndex,
}: FieldProps) => {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Opsi Jawaban</h4>
        <Button
          size="small"
          onClick={() =>
            appendOption({
              text: "",
              isCorrect: false,
            })
          }
        >
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Tambah Opsi
        </Button>
      </div>

      {optionFields.map((option, optionIndex) => (
        <div key={option.id} className="flex items-center gap-3 mb-3">
          <RadioField
            control={control}
            name={`questions.${questionIndex}.correctAnswer`}
            value={optionIndex.toString()}
            placeholder=""
            errors={errors}
          />
          <TextField
            control={control}
            name={`questions.${questionIndex}.options.${optionIndex}.text`}
            placeholder="Masukkan opsi jawaban"
            errors={errors}
          />
          <Button
            variant="danger"
            size="small"
            onClick={() => removeOption(optionIndex)}
            disabled={optionFields.length <= 2}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export const TrueOrFalseField = ({
  control,
  errors,
  questionIndex,
}: FieldProps) => {
  const trueFalseOptions = [
    { value: "true", label: "Benar" },
    { value: "false", label: "Salah" },
  ];

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium mb-3">Jawaban yang Benar</h4>
      <RadioField
        control={control}
        name={`questions.${questionIndex}.correctAnswer`}
        options={trueFalseOptions}
        errors={errors}
      />
    </div>
  );
};

export const FillInTheBlankField = ({
  control,
  errors,
  questionIndex,
}: FieldProps) => {
  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium mb-3">Jawaban yang Benar</h4>
      <TextField
        control={control}
        name={`questions.${questionIndex}.correctAnswer`}
        placeholder="Masukkan jawaban yang benar"
        errors={errors}
      />
    </div>
  );
};

export const EssayField = () => {
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <p className="text-sm text-gray-600">
        Untuk soal esai, jawaban akan dinilai secara manual oleh pengajar.
      </p>
    </div>
  );
};
