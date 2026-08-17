import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { dctoolsApi, extractErrorMessage } from "../../config/api";

export default function FeedbackDetail() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    dctoolsApi
      .get(`/admin/feedback/${id}`)
      .then((res) => setFeedback(res.data.feedback))
      .catch(async (err) => setError(await extractErrorMessage(err)));
  }, [id]);

  return (
    <div>
      <Link
        to="/dctools/feedback"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
        Back to Feedback
      </Link>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {feedback && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Name</p>
            <p className="text-base font-medium">{feedback.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Email</p>
            <p className="text-base">{feedback.email}</p>
          </div>
          {feedback.toolName && (
            <div>
              <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Tool</p>
              <p className="text-base">{feedback.toolName}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Feedback</p>
            <p className="text-base whitespace-pre-wrap">{feedback.message}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Submitted</p>
            <p className="text-base">{new Date(feedback.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
