import { style } from "@mui/system";
import type { ReactNode } from "react";
import React from "react";
import type { ListChildComponentProps } from "react-window";
import { FixedSizeList } from "react-window";

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
