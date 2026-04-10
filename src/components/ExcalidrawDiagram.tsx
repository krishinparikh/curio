'use client';

import { useEffect, useRef, useState } from 'react';

interface ExcalidrawDiagramProps {
  mermaidSource: string;
}

export function ExcalidrawDiagram({ mermaidSource }: ExcalidrawDiagramProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const [
          { parseMermaidToExcalidraw },
          { convertToExcalidrawElements },
          { exportToSvg },
        ] = await Promise.all([
          import('@excalidraw/mermaid-to-excalidraw'),
          import('@excalidraw/excalidraw'),
          import('@excalidraw/utils'),
        ]);

        const { elements: skeletons, files } =
          await parseMermaidToExcalidraw(mermaidSource);

        const elements = convertToExcalidrawElements(skeletons);

        const svg = await exportToSvg({
          elements,
          files: files ?? null,
          appState: {
            exportWithDarkMode: false,
            exportBackground: false,
          },
          exportPadding: 16,
        });

        if (cancelled) return;

        svg.style.width = '100%';
        svg.style.height = 'auto';
        setSvgHtml(svg.outerHTML);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error('Mermaid → Excalidraw conversion failed:', err);
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setLoading(false);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [mermaidSource]);

  if (error) {
    return (
      <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm my-4">
        <code>{mermaidSource}</code>
      </pre>
    );
  }

  return (
    <div className="my-4 flex justify-center">
      <div className="rounded-lg border bg-white p-4 w-full max-w-3xl">
        {loading && (
          <p className="text-muted-foreground text-center text-sm py-8">
            Rendering diagram...
          </p>
        )}
        {svgHtml && (
          <div dangerouslySetInnerHTML={{ __html: svgHtml }} />
        )}
      </div>
    </div>
  );
}
