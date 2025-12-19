import Navbar from '@/components/layout/Navbar';

export function generateStaticParams() {
    return [{ locale: 'ko' }, { locale: 'en' }, { locale: 'ja' }, { locale: 'zh' }];
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-4xl mx-auto pt-40 px-6 pb-20">
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-12 tracking-wider uppercase">
                    Contact & FAQ
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-blue-500">Get in Touch</h2>
                        <div className="space-y-6 text-gray-300">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Address</h3>
                                <p>Dongseo University<br />47 Jurye-ro, Sasang-gu<br />Busan, South Korea 47011</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Department</h3>
                                <p>Digital Contents / Animation</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Email</h3>
                                <a href="mailto:animation@dsu.ac.kr" className="text-white hover:text-blue-400 transition">
                                    animation@dsu.ac.kr
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 text-blue-500">FAQ</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold mb-2">How can I contact a student creator?</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Please send an email to our department representative with the <strong>Project Title</strong> and <strong>Student Name</strong>. We will forward your inquiry to the creator.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">Are these projects available for distribution?</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Most graduation projects are available for festival screening and distribution deals. Licensing status varies by project.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-2">Can I download the assets?</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    No, all assets displayed on this site are the intellectual property of the respective students and Dongseo University. Unauthorized use is prohibited.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
