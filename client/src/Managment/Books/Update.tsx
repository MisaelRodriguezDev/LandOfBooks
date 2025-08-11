import { useState } from "react";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBookSchema, type UpdateBookFormData } from "@/schemas/books";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import TextArea from "@/components/ui/TextArea/TextArea";
import Button from "@/components/ui/Button/Button";
import SelectField from "@/components/ui/SelectField/SelectField";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import { updateBookRequest } from "@/services/books";
import type { UUID } from "crypto";

type UpdateBookProps = {
  id: UUID;
  onSuccess: () => void;
  initialData: Partial<UpdateBookFormData> & {
    author_ids: string[];
    genre_ids: string[];
  };
  publishers: { id: string; name: string }[];
  authors: { id: string; full_name: string }[];
  genres: { id: string; name: string }[];
};

export default function UpdateBook({
  id,
  onSuccess,
  initialData,
  publishers,
  authors,
  genres,
}: Readonly<UpdateBookProps>) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateBookFormData>({
    resolver: zodResolver(updateBookSchema),
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: initialData,
  });

  const values = useWatch({ control });
  const requiredFields = ["isbn", "title"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  //const { getChangedFields, changedCount } = useFormChanges({ watch, dirtyFields });

  const onSubmit: SubmitHandler<UpdateBookFormData> = async (data) => {
    //if (changedCount === 0) return;
    try {
      setLoading(true);
      //const data = getChangedFields();
      await updateBookRequest(id, data);
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
        <h2>Editar Libro</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<UpdateBookFormData>
            label="ISBN"
            id="isbn"
            type="text"
            register={register}
            error={errors.isbn}
          />
          <FormField<UpdateBookFormData>
            label="Título"
            id="title"
            type="text"
            register={register}
            error={errors.title}
          />
          <TextArea<UpdateBookFormData>
            label="Descripción"
            id="description"
            register={register}
            error={errors.description}
          />
          <FormField<UpdateBookFormData>
            label="Portada (URL)"
            id="cover"
            type="text"
            register={register}
            error={errors.cover}
          />
          <FormField<UpdateBookFormData>
            label="Año de publicación"
            id="year_of_publication"
            type="number"
            register={register}
            error={errors.year_of_publication}
          />
          <SelectField<UpdateBookFormData>
            label="Editorial"
            id="publisher_id"
            options={publishers.map(a => ({ value: a.id, label: a.name }))}
            register={register}
            error={errors.publisher_id}
            />
          {errors.publisher_id && <p className={styles.error}>{errors.publisher_id.message}</p>}

          <SelectField<UpdateBookFormData>
            label="Autores"
            id="author_ids"
            options={authors.map(a => ({ value: a.id, label: a.full_name }))}
            register={register}
            defaultValue={initialData.author_ids}
            multiple={true}
          />

          <SelectField<UpdateBookFormData>
            label="Géneros"
            id="genre_ids"
            options={genres.map(g => ({ value: g.id, label: g.name }))}
            register={register}
            defaultValue={initialData.genre_ids}
            multiple={true}
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
