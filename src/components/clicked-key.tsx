import { Component, JSX } from 'solid-js';

interface ClickedKeyProps {
  children: JSX.Element;
}
const ClickedKey: Component<ClickedKeyProps> = (props) => {
  return (
    <div class="p-2 px-3 border-solid border-r-slate-400 border-b-slate-500 border-r-4 border-b-4 rounded-md min-w-[40px] w-cax grid place-content-center bg-slate-200 font-medium">
      {props.children}
    </div>
  );
};

export { ClickedKey };
