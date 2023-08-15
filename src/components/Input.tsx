interface InputProps {
    placeholder: string;
    id: string;
    error?: string;
    onChange?: React.ComponentProps<"input">["onChange"];
}

const Input = ({ placeholder, id, error, onChange }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id}>Find A Stock:</label>
            <input
                id={id}
                type="text"
                placeholder={placeholder}
                onChange={onChange}
                className="rounded-md border border-blue-600 px-2 py-1 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue-600"
            />

            {error !== undefined && (
                <span className="text-sm text-red-600">{error}</span>
            )}
        </div>
    );
};

export default Input;
