export default function AuthCodeError() {
    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Authentication Error</h2>
            <p className="text-slate-600">There was an error verifying your authentication code.</p>
        </div>
    )
}
