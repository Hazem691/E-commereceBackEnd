const dataMethod = ["body", "query", "params", "headers", "file", "files"];

export const validation = (validateApi) => {
    return (req, res, next) => {
        try {
            const validationErrors = [];

            dataMethod.forEach((key) => {
                if (validateApi[key]) {
                    const data = validateApi[key].validate(req[key], { abortEarly: false });
                    if (data.error) {
                        validationErrors.push(data.error.details);
                    }
                }
            });

            if (validationErrors.length > 0) {
                return res.status(400).json({ errors: validationErrors });
            }

            next();
        } catch (error) {
            console.error('Validation middleware error:', error);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    };
};
