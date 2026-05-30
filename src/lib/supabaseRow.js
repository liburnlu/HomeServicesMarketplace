/** PostgREST error when .single() gets 0 or 2+ rows */
export const PGRST_NOT_SINGLE = "PGRST116";

export function isNotSingleRowError(error) {
    return (
        error?.code === PGRST_NOT_SINGLE ||
        String(error?.message ?? "").includes(
            "Cannot coerce the result to a single JSON object"
        )
    );
}

export function assertSingleRow(data, message) {
    if (!data) {
        const err = new Error(
            message ??
                "No row was updated. Check that you are signed in and allowed to change this record."
        );
        err.code = PGRST_NOT_SINGLE;
        throw err;
    }
    return data;
}

export function wrapSupabaseError(error, contextMessage) {
    if (!error) return error;
    if (isNotSingleRowError(error)) {
        const err = new Error(
            contextMessage ??
                "This action did not complete. You may not have permission, or the record no longer exists."
        );
        err.code = PGRST_NOT_SINGLE;
        return err;
    }
    return error;
}
