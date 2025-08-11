import { useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CreateBookCopyFormData, createBookCopySchema } from "@/schemas/copies";
import AppForm from "@/components/ui/Form/Form";
import FormField from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import SelectField from "@/components/ui/SelectField/SelectField";
import { createBookCopyRequest } from "@/services/copies";
import styles from "@/styles/Form.module.css";
import { BCStatus, type BookCopyStatus } from "@/types/copies";
import { useButtonEnablement } from "@/hooks/useButtonEnablement";
import type { UUID } from "crypto";

type CreateBookCopyProps = {
  onSuccess: () => void;
  books: { id: UUID; title: string }[]
};

const statusOptions: { value: BookCopyStatus; label: string }[] = [
  { value: BCStatus.AVAILABLE, label: "Disponible" },
  { value: BCStatus.LOANED, label: "Prestado" },
  { value: BCStatus.LOST, label: "Perdido" },
  { value: BCStatus.REMOVED, label: "Removido" }
];

export default function CreateBookCopy({onSuccess, books}: Readonly<CreateBookCopyProps>) {
    const [loading, setLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateBookCopyFormData>({
        resolver: zodResolver(createBookCopySchema),
        mode: "onBlur",
        criteriaMode: 'all',
        defaultValues: {
            status: BCStatus.AVAILABLE
        }
    });

    const values = useWatch({control});
    const requiredFields = ["book_id"]
    const enabled = useButtonEnablement(values, errors, requiredFields);
    const onSubmit: SubmitHandler<CreateBookCopyFormData> = async (data) => {
        try {
            setLoading(true)
            const result = await createBookCopyRequest(data)
            console.log(result)
            onSuccess()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form_container}>
                <h2>Crear Copia de Libro</h2>
                <AppForm parentMethod={handleSubmit(onSubmit)}>
                    <SelectField<CreateBookCopyFormData>
                        label="Libro"
                        id="book_id"
                        register={register}
                        error={errors.book_id}
                        options={books.map(a => ({ value: a.id, label: a.title }))}
                    />
                    <FormField<CreateBookCopyFormData>
                        label="Código de barras"
                        id="barcode"
                        type="number"
                        register={register}
                        error={errors.barcode}
                    />
                    <SelectField<CreateBookCopyFormData>
                        label="Estado"
                        id="status"
                        register={register}
                        error={errors.status}
                        options={statusOptions}
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