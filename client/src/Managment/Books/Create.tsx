import { useState } from "react";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookSchema, type CreateBookFormData } from "@/schemas/books";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import TextArea from "@/components/ui/TextArea/TextArea";
import Button from "@/components/ui/Button/Button";
import SelectField from "@/components/ui/SelectField/SelectField";
import styles from "@/styles/Form.module.css";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import { createBookRequest } from "@/services/books";

type CreateBookProps = {
  onSuccess: () => void;
  publishers: { id: string; name: string }[];
  authors: { id: string; full_name: string }[];
  genres: { id: string; name: string }[];
};

export default function CreateBook({ onSuccess, publishers, authors, genres }: Readonly<CreateBookProps>) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
    mode: "onBlur",
    criteriaMode: "all"
  });

  const values = useWatch({ control });
  const requiredFields = ["isbn", "title", "description", "cover", "year_of_publication", "publisher_id", "author_ids", "genre_ids"];
  const enabled = useButtonEnablement(values, errors, requiredFields);

  const onSubmit: SubmitHandler<CreateBookFormData> = async (data) => {
    try {
      setLoading(true);
      console.log(data)
      await createBookRequest(data);
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
        <h2>Crear Libro</h2>
        <AppForm parentMethod={handleSubmit(onSubmit)}>
          <FormField<CreateBookFormData>
            label="ISBN"
            id="isbn"
            type="text"
            register={register}
            error={errors.isbn}
          />
          <FormField<CreateBookFormData>
            label="Título"
            id="title"
            type="text"
            register={register}
            error={errors.title}
          />
          <TextArea<CreateBookFormData>
            label="Descripción"
            id="description"
            register={register}
            error={errors.description}
          />
          <FormField<CreateBookFormData>
            label="Portada (URL)"
            id="cover"
            type="text"
            register={register}
            error={errors.cover}
          />
          <FormField<CreateBookFormData>
            label="Año de publicación"
            id="year_of_publication"
            type="number"
            register={register}
            error={errors.year_of_publication}
          />
          
          <SelectField<CreateBookFormData>
            label="Editorial"
            id="publisher_id"
            options={publishers.map(a => ({ value: a.id, label: a.name }))}
            register={register}
            error={errors.publisher_id}
            />

          <SelectField<CreateBookFormData>
            label="Autores"
            id="author_ids"
            options={authors.map(a => ({ value: a.id, label: a.full_name }))}
            register={register}
            multiple={true}
          />

          <SelectField<CreateBookFormData>
            label="Géneros"
            id="genre_ids"
            options={genres.map(g => ({ value: g.id, label: g.name }))}
            register={register}
            multiple={true}
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
