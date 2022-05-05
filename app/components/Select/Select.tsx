import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import React, { Fragment, useMemo, useState } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({
  children,
  className,
  name,
  placeholder,
  defaultValue,
  ...props
}) => {
  const options = useMemo(
    () =>
      React.Children.map(children, (option) => {
        if (!React.isValidElement<HTMLOptionElement>(option)) {
          return;
        }
        return { name: option.props.children, value: option.props.value };
      }),
    [children]
  );
  const [selected, setSelected] = useState<Option>({
    name: options?.find((option) => option.value === defaultValue)?.name || "",
    value: defaultValue,
  });
  return (
    <>
      <input
        type="hidden"
        value={selected.value}
        hidden
        name={name}
        data-testid="select"
      />
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className={[
              "relative w-full min-w-[7rem] border-b-2 border-tomato bg-inherit pr-10 text-left text-2xl font-bold text-tomato hover:opacity-80  ",
              className,
            ].join(" ")}
          >
            <span className="block truncate text-2xl">
              {selected.name || placeholder || "Please select..."}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-tomato">
              <SelectorIcon
                className="h-5 w-5 text-tomato"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-md bg-white py-1 text-base shadow-xl ">
              {options &&
                options.map((option, i) => {
                  return (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `relative select-none py-2 px-3 hover:cursor-pointer ${
                          active && "bg-tomato bg-opacity-10 text-tomato"
                        }`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block ${
                              selected ? "font-bold text-tomato" : "font-normal"
                            }`}
                          >
                            {option.name}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
};

type Option = {
  name: string | HTMLCollection;
  value: string | number | readonly string[] | undefined;
};
