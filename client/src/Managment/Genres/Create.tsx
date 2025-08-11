import { type SubmitHandler, useForm, useWatch  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateGenreFormData, createGenreSchema } from "@/schemas/genres";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import TextArea from "@/components/ui/TextArea/TextArea";
import Button from "@/components/ui/Button/Button";
import styles from "@/styles/Form.module.css"
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import { useState } from "react";
import { createGenreRequest } from "@/services/genres";

type CreateGenreProps = {
    onSuccess: () => void;
};

export default function CreateGenre({onSuccess}: Readonly<CreateGenreProps>) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateGenreFormData>({
        resolver: zodResolver(createGenreSchema),
        mode: "onBlur",
        criteriaMode: 'all'
    });

    const values = useWatch({ control });
    const requiredFields = ["name"];
    const enabled = useButtonEnablement(values, errors, requiredFields);

    const onSubmit: SubmitHandler<CreateGenreFormData> = async (data) => {
        try {
            setLoading(true)
            const result = await createGenreRequest(data)
            console.log(result)
            onSuccess()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <h2>Crear Género</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <FormField<CreateGenreFormData>
                        label="Nombre"
                        id="name"
                        type="text"
                        register={register}
                        error={errors.name}
                    />
                    <TextArea<CreateGenreFormData>
                        label="Descripción"
                        id="description"
                        register={register}
                        error={errors.description}
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
    )
}