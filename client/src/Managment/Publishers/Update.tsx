import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UpdatePublisherFormData, updatePublisherSchema } from "@/schemas/publishers";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import useFormChanges from "@/hooks/useFormChanges";
import { useState } from "react";
import { updatePublisherRequest } from "@/services/publishers";
import type { UUID } from "crypto"; // o string si no usas UUID real

type UpdatePublisherProps = {
  id: UUID;
  onSuccess: () => void;
  initialData?: Partial<UpdatePublisherFormData>;
};

export default function UpdatePublisher({
  id,
  onSuccess,
  initialData
}: Readonly<UpdatePublisherProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, dirtyFields },
    watch
  } = useForm<UpdatePublisherFormData>({
    resolver: zodResolver(updatePublisherSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...initialData
    }
  });

  const values = useWatch({ control });
  const requiredFields = ["name"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const { getChangedFields, changedCount } = useFormChanges({
    watch,
    dirtyFields
  });

  const onSubmit: SubmitHandler<UpdatePublisherFormData> = async () => {
    try {
      if (changedCount === 0) return;
      setLoading(true);
      const data = getChangedFields();
      const result = await updatePublisherRequest(id, data);
      console.log(result);
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
        <h2>Editar Editorial</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<UpdatePublisherFormData>
            label="Nombre"
            id="name"
            type="text"
            register={register}
            error={errors.name}
          />
          <FormField<UpdatePublisherFormData>
            label="Teléfono"
            id="phone"
            type="text"
            register={register}
            error={errors.phone}
          />
          <FormField<UpdatePublisherFormData>
            label="URL de Imagen"
            id="image_url"
            type="text"
            register={register}
            error={errors.image_url}
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
