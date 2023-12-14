import React, { ReactNode } from "react";
import { styled, Popper } from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { style } from "@mui/system";

export const StyledPopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
  },
  [`& .${autocompleteClasses.option}`]: {
    borderBottom: "1px solid",
    borderColor: theme.palette.text.secondary,
    color: theme.palette.primary.dark,
    "& .MuiTypography-caption": { color: "grey" },
  },
  [`& .${autocompleteClasses.paper}`]: {
    borderRadius: 0,
    marginRight: "1px",
    marginLeft: "1px",
    color: theme.palette.primary.light,
  },
}));

export const StyledDatePopper = styled(Popper)(({ theme }) => ({
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    display: "flex",
    flexFlow: "row wrap",
  },
  [`& .${autocompleteClasses.option}`]: {
    flexBasis: "148px",
    margin: 1,
    borderColor: theme.palette.text.secondary,
    color: theme.palette.primary.dark,
    "& .MuiTypography-caption": { color: "grey" },
  },
  [`& .${autocompleteClasses.paper}`]: {
    width: "450px",
    borderRadius: 0,
    marginRight: "1px",
    marginLeft: "1px",
    color: theme.palette.primary.light,
  },
}));

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} style={{ ...style }} {...props} {...outerProps} />;
});

const LISTBOX_PADDING = 4;

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  return <div style={inlineStyle}>{dataSet}</div>;
}

type ParentNode = ReactNode & { children?: ReactNode[] };

// Adapter for react-window
export const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData: ReactNode[] = [];

  for (const child of children as ParentNode[]) {
    itemData.push(child);
    itemData.push(...(child.children ?? []));
  }

  const itemCount = itemData.length;
  const itemSize = 57;

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemCount * itemSize;
  };

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={itemSize}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});
