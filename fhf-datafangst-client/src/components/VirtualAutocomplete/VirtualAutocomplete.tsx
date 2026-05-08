import {
  Autocomplete,
  type AutocompleteProps,
  type ChipTypeMap,
} from "@mui/material";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import {
  List,
  useListRef,
  type ListImperativeAPI,
  type RowComponentProps,
} from "react-window";

type ReplaceReturnType<T extends (...args: any) => any, R> = (
  ...args: Parameters<T>
) => R;

type RenderOptionReturn<Value> = [Value, ReactElement];

type Props<
  Value,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
> = Omit<
  AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>,
  "renderOption"
> & {
  optionKey: (option: Value) => PropertyKey;
  renderOption: ReplaceReturnType<
    Required<
      AutocompleteProps<
        Value,
        Multiple,
        DisableClearable,
        FreeSolo,
        ChipComponent
      >
    >["renderOption"],
    RenderOptionReturn<Value>
  >;
};

export const VirtualAutocomplete = <
  Value,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
>({
  slotProps,
  optionKey,
  renderOption,
  onHighlightChange,
  ...props
}: Props<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>) => {
  const internalListRef = useListRef(null);

  const optionIndexMapRef = useRef<Map<PropertyKey, number>>(new Map());

  const handleItemsBuilt = useCallback(
    (optionIndexMap: Map<PropertyKey, number>) => {
      optionIndexMapRef.current = optionIndexMap;
    },
    [],
  );

  // Handle keyboard navigation by scrolling to highlighted option
  const handleHighlightChange = (option: Value | null) => {
    if (option && internalListRef.current) {
      const key = optionKey(option);
      const index = optionIndexMapRef.current.get(key);
      if (index !== undefined) {
        internalListRef.current.scrollToRow({ index, align: "auto" });
      }
    }
  };

  return (
    <Autocomplete
      {...props}
      slotProps={{
        ...slotProps,
        listbox: {
          component: ListboxComponent,
          optionKey,
          internalListRef,
          onItemsBuilt: handleItemsBuilt,
        } as any,
      }}
      // Need to cast as ReactNode to prevent React from modifying the value
      renderOption={(...args) => renderOption(...args) as ReactNode}
      onHighlightChange={(event, option, reason) => {
        handleHighlightChange(option);
        onHighlightChange?.(event, option, reason);
      }}
    />
  );
};

const LISTBOX_PADDING = 4;

function RowComponent({
  data,
  index,
  style,
}: RowComponentProps & {
  data: RenderOptionReturn<unknown>[];
}) {
  const [_, elem] = data[index];
  const inlineStyle = {
    ...style,
    top: ((style.top as number) ?? 0) + LISTBOX_PADDING,
  };

  return <div style={inlineStyle}>{elem}</div>;
}

type ListboxProps<Option> = HTMLAttributes<HTMLElement> & {
  optionKey: (option: Option) => PropertyKey;
  internalListRef: Ref<ListImperativeAPI>;
  onItemsBuilt: (optionIndexMap: Map<PropertyKey, number>) => void;
};

const ListboxComponent = forwardRef(ListboxComponentInner);

function ListboxComponentInner<Option>(
  {
    children,
    optionKey,
    internalListRef,
    onItemsBuilt,
    style,
    ...props
  }: ListboxProps<Option>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const data = children as RenderOptionReturn<Option>[];

  const optionIndexMap = useMemo(() => {
    const map = new Map<PropertyKey, number>();
    for (let i = 0; i < data.length; i++) {
      map.set(optionKey(data[i][0]), i);
    }
    return map;
  }, [data]);

  useEffect(() => onItemsBuilt(optionIndexMap), [optionIndexMap]);

  const itemSize = 57;
  const itemCount = data.length;

  return (
    <div ref={ref} style={{ ...style, maxHeight: "100%" }} {...props}>
      <List
        key={itemCount}
        listRef={internalListRef}
        rowCount={itemCount}
        rowHeight={itemSize}
        rowComponent={RowComponent}
        rowProps={{ data }}
        overscanCount={5}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: Math.min(data.length, 8) * itemSize + 2 * LISTBOX_PADDING,
        }}
      />
    </div>
  );
}
