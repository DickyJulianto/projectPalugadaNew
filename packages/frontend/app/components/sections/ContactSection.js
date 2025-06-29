"use client"; // Form akan membutuhkan interaktivitas client-side

export default function ContactSection() {
    // Logika untuk mengirim form akan kita implementasikan nanti
    const handleSubmit = (event) => {
        event.preventDefault();
        alert(
            "Terima kasih! Pesan Anda akan segera kami proses. (Fitur sedang dalam pengembangan)"
        );
        event.target.reset();
    };

    return (
        <section id="contact" className="contact">
            <h1 className="heading">Masih Ragu?</h1>
            <h3 className="title">Tim Support kami siap bantu kamu 24/7!</h3>

            <div className="row">
                <div className="image">
                    <img src="/assets/images/cs-img.png" alt="contact_image" />
                </div>

                <div className="form_container">
                    <form id="contactForm" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="fullName"
                            placeholder="Full Name"
                            required
                        />
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Phone Number"
                            required
                        />
                        <textarea
                            id="message"
                            cols="30"
                            rows="10"
                            placeholder="Message"
                            required
                        ></textarea>
                        <input type="submit" value="Submit" />
                        <input type="reset" value="Reset" />
                    </form>
                </div>
            </div>
        </section>
    );
}
