import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreatePublisherFormData, createPublisherSchema } from "@/schemas/publishers";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import { useState } from "react";
import { createPublisherRequest } from "@/services/publishers";

type CreatePublisherProps = {
  onSuccess: () => void;
};

export default function CreatePublisher({ onSuccess }: Readonly<CreatePublisherProps>) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<CreatePublisherFormData>({
    resolver: zodResolver(createPublisherSchema),
    mode: "onBlur",
    criteriaMode: "all"
  });

  const values = useWatch({ control });
  const requiredFields = ["name"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const onSubmit: SubmitHandler<CreatePublisherFormData> = async (data) => {
    try {
      setLoading(true);
      const result = await createPublisherRequest(data);
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
        <h2>Crear Editorial</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<CreatePublisherFormData>
            label="Nombre"
            id="name"
            type="text"
            register={register}
            error={errors.name}
          />
          <FormField<CreatePublisherFormData>
            label="Teléfono"
            id="phone"
            type="text"
            register={register}
            error={errors.phone}
          />
          <FormField<CreatePublisherFormData>
            label="URL de Imagen"
            id="image_url"
            type="text"
            register={register}
            error={errors.image_url}
          />
          <div className={styles.button_container}>
            <Button
              action="create"
              content="Crear"
              content_loading="Creando..."
              loading={loading}
              enabled={enabled}
            />
          </div>
        </AppForm>
      </div>
    </div>
  );
}
