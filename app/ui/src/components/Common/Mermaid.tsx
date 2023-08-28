import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Tooltip } from "antd";
import { CheckIcon, CloudArrowDownIcon } from "@heroicons/react/24/solid";

const Mermaid = React.memo((props: { code: string }) => {
  const ref: React.Ref<any> | null = useRef(null);
  const [isError, setIsError] = React.useState(false);
  const [isBtnPressed, setIsBtnPressed] = React.useState(false);

  React.useEffect(() => {
    if (isBtnPressed) {
      setTimeout(() => {
        setIsBtnPressed(false);
      }, 4000);
    }
  }, [isBtnPressed]);
  const render = async () => {
    try {
      const { svg } = await mermaid.render(
        "id" + Math.random().toString(36).substr(2, 9),
        props.code
      );

      if (ref.current != null) {
        ref.current.innerHTML = svg;
      }
    } catch (e) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (ref.current != null) {
      mermaid.initialize({
        startOnLoad: false,
        flowchart: {
          useMaxWidth: true,
        },
        logLevel: 0,
        darkMode: true,
      });

      render();
    }
  }, []);

  return !isError ? (
    <div className="code relative border text-base bg-gray-800 rounded-md overflow-hidden text-white">
      <div className="flex items-center justify-between py-1.5 px-4">
        <span className="text-xs lowercase text-gray-200">Mermaid</span>

        <div className="flex items-center">
          <Tooltip title="Download as SVG">
            <button
              onClick={() => {
                const svg = ref.current.innerHTML;
                const blob = new Blob([svg], {
                  type: "image/svg+xml;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.download = `mermaid-${Date.now()}.svg`;
                link.click();

                setIsBtnPressed(true);
              }}
              className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-gray-200 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              {!isBtnPressed ? (
                <CloudArrowDownIcon className="h-4 w-4" />
              ) : (
                <CheckIcon className="h-4 w-4 text-green-400" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      <div ref={ref} className="py-3 text-md bg-white" />
    </div>
  ) : (
    <>
      <p className="bg-gray-300 text-gray-900 p-2 rounded-md text-sm">
        {props.code}
      </p>
      <span className="text-red-700 text-xs">
        Generated code is not valid mermaid code
      </span>
    </>
  );
});

export default Mermaid;
