export default function LegalModal({
  title,
  markdown,
  onClose,
}: {
  title: string;
  markdown: string;
  onClose: () => void;
}) {
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl p-8 bg-base-100 rounded-2xl shadow-2xl">
        <h2 className="font-bold text-2xl mb-4 text-primary">{title}</h2>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <div
            className="
              prose dark:prose-invert max-w-none
              prose-headings:font-semibold
              prose-h1:text-primary prose-h2:text-secondary prose-h3:text-accent
              prose-p:leading-relaxed
              prose-li:my-2 prose-ul:my-4 prose-ol:my-4
              prose-strong:text-primary
              prose-a:text-info prose-a:underline hover:prose-a:text-info/80
              [&_ul]:list-disc [&_ul]:pl-6
              [&_ol]:list-decimal [&_ol]:pl-6
            "
            dangerouslySetInnerHTML={{ __html: markdown }}
          />
        </div>

        <div className="modal-action mt-6">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
