import { Box, SxProps } from "@mui/material";
import { FC, ReactNode, useRef } from "react";

interface Props {
  accept?: string;
  children: ReactNode;
  sx?: SxProps;
  onChange: (value: string) => void;
}

export const FileUpload: FC<Props> = ({ accept, children, sx, onChange }) => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <Box
      sx={{
        width: "fit-content",
        ...sx,
      }}
      onClick={() => ref.current?.click()}
    >
      {children}
      <input
        ref={ref}
        type="file"
        accept={accept}
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          visibility: "hidden",
        }}
        onChange={(e) => {
          const files = e.target.files;
          if (files?.length !== 1) return;

          const reader = new FileReader();

          reader.onload = () => {
            e.target.value = "";
            const result = (reader.result as string).splitOnce("base64,");
            if (result) {
              onChange(result[1]);
            }
          };

          reader.readAsDataURL(files[0]);
        }}
      />
    </Box>
  );
};
