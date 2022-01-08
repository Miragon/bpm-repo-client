import { makeStyles } from "@material-ui/core";
import React, { useCallback } from "react";
import Dropzone from "react-dropzone";

const useStyles = makeStyles(() => ({
    uploadContainer: {
        alignItems: "center",
        minWidth: "100%",
        marginBottom: "1rem"
    },
    uploadArea: {
        width: "100%",
        textAlign: "center",
        verticalAlign: "middle",
        padding: "1rem",
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "5px",
        "&:hover": {
            cursor: "pointer",
        },
    },
    description: {
        marginTop: "0px",
        marginBottom: "0px",
        textAlign: "center",
    }
}));

interface ImageUploadProps {
    onChanged: (value: File) => void;
    onError: (error: string) => void;
    value: string | undefined;
    type?: string;
    prompt: string;
    promptIcon: React.ReactNode;
}

const FileUploadField: React.FC<ImageUploadProps> = props => {
    const classes = useStyles();

    const {
        value,
        onError,
        onChanged,
        type
    } = props;

    const onDrop = useCallback(async (files: File[]) => {
        if (files.length === 0) {
            return;
        }

        try {
            onChanged(files[0]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            onError(e.message);
        }
    }, [onChanged, onError]);

    return (
        <div className={classes.uploadContainer}>
            <Dropzone
                multiple={false}
                accept={type}
                onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()} className={classes.uploadArea}>
                            <input {...getInputProps()} />
                            {props.promptIcon}
                            <p className={classes.description}>
                                {value}
                                {!value && props.prompt}
                            </p>
                        </div>
                    </section>
                )}
            </Dropzone>
        </div>
    );
};

export default FileUploadField;
