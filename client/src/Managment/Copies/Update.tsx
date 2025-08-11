import { useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdateBookCopyFormData, updateBookCopySchema } from "@/schemas/copies";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import SelectField from "@/components/ui/SelectField/SelectField";
import styles from "@/styles/Form.module.css";
import { BCStatus, type BookCopyStatus } from "@/types/copies";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import useFormChanges from "@/hooks/useFormChanges";
import { updateBookCopyRequest } from "@/services/copies";
import type { UUID } from "crypto";

type UpdateBookCopyProps = {
  id: UUID;
  onSuccess: () => void;
  initialData: Partial<UpdateBookCopyFormData>;
  books: { id: string; title: string }[];
};

const statusOptions: { value: BookCopyStatus; label: string }[] = [
  { value: BCStatus.AVAILABLE, label: "Disponible" },
  { value: BCStatus.LOANED, label: "Prestado" },
  { value: BCStatus.LOST, label: "Perdido" },
  { value: BCStatus.REMOVED, label: "Removido" },
];

export default function UpdateBookCopy({
  id,
  onSuccess,
  initialData,
}: Readonly<UpdateBookCopyProps>) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    watch,
  } = useForm<UpdateBookCopyFormData>({
    resolver: zodResolver(updateBookCopySchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: initialData,
  });

  const values = useWatch({ control });
  const requiredFields = ["book_id"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const { getChangedFields, changedCount } = useFormChanges({
    watch,
    dirtyFields,
  });

  const onSubmit: SubmitHandler<UpdateBookCopyFormData> = async () => {
    if (changedCount === 0) return;
    try {
      setLoading(true);
      const data = getChangedFields();
      await updateBookCopyRequest(id, data);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.form_container}>
        <h2>Editar Copia de Libro</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>

          <FormField<UpdateBookCopyFormData>
            label="Código de barras"
            id="barcode"
            type="text"
            register={register}
            error={errors.barcode}
          />
          <SelectField<UpdateBookCopyFormData>
            label="Estado"
            id="status"
            register={register}
            error={errors.status}
            options={statusOptions}
          />
          <div className={styles.button_container}>
            <Button
              action="update"
              content="Actualizar"
              content_loading="Actualizando..."
              loading={loading}
              enabled={enabled}
            />
          </div>
        </AppForm>
      </div>
    </div>
  );
}
