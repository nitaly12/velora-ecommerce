export default function InfoPage({ params }: { params: { slug: string } }) {
    const title = params.slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())

    return (
        <div className="container mx-auto px-4 py-24 max-w-3xl">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">{title}</h1>
            <div className="prose prose-slate lg:prose-lg max-w-none space-y-6">
                <p className="text-lg text-slate-600 leading-relaxed">
                    We're currently updating this section to provide you with the most accurate and up-to-date information.
                    Thank you for your patience as we refine our premium shopping experience.
                </p>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 italic text-slate-500">
                    "Elegance is not standing out, but being remembered."
                </div>
                <p className="text-slate-600">
                    If you have immediate questions, please reach out to our support team at <span className="font-semibold text-slate-900">support@velora.com</span>.
                </p>
            </div>
        </div>
    )
}
