// Karena ada form, kita jadikan client component untuk interaktivitas di masa depan
"use client";

export default function Footer() {
    const handleNewsletterSubmit = (event) => {
        event.preventDefault();
        alert(
            "Terima kasih telah berlangganan! (Fitur sedang dalam pengembangan)"
        );
        event.target.reset();
    };

    return (
        <footer>
            <section id="footer">
                <div className="footer_container">
                    <div className="footer_content">
                        <div className="footer_heading1 logo">
                            <div className="logo_content">
                                <img
                                    src="/assets/logo/logo-fix.png"
                                    alt="logo_footer"
                                />
                                <p>
                                    Jasa game Boosting Tepercaya Dan Serba Bisa
                                </p>
                            </div>
                            <ul>
                                <li>
                                    <a href="#">
                                        <i className="fa-brands fa-facebook"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa-brands fa-instagram"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa-brands fa-twitter"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa-brands fa-youtube"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fas fa-envelope"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fas fa-globe"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer_heading1 row1">
                            <h3>About Us</h3>
                            <li>
                                <a href="#">FAQ's</a>
                            </li>
                            <li>
                                <a href="#">Official Partner</a>
                            </li>
                            <li>
                                <a href="#">Customer Services</a>
                            </li>
                            <li>
                                <a href="#">Terms & Conditions</a>
                            </li>
                            <li>
                                <a href="#">Client</a>
                            </li>
                        </div>

                        <div className="footer_heading1 row1">
                            <h3>Site Map</h3>
                            <li>
                                <a href="#">Office</a>
                            </li>
                            <li>
                                <a href="#">Branch Office</a>
                            </li>
                            <li>
                                <a href="#">Product</a>
                            </li>
                            <li>
                                <a href="#">Services</a>
                            </li>
                            <li>
                                <a href="#">Contact</a>
                            </li>
                        </div>

                        <div className="footer_heading1 row1">
                            <h3>Other's</h3>
                            <li>
                                <a href="#">Affiliate</a>
                            </li>
                            <li>
                                <a href="#">Carreer</a>
                            </li>
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#">Cookie Policy</a>
                            </li>
                        </div>

                        <div className="footer_heading2 row2">
                            <h3>Join our newsletter!</h3>
                            <p>
                                Untuk Mendapatkan info dan Promo menarik Lainnya
                            </p>
                            <form onSubmit={handleNewsletterSubmit}>
                                <input
                                    type="email"
                                    id="email_input"
                                    placeholder="Input Your Email"
                                    required
                                />
                                <input
                                    type="submit"
                                    value="Sign Up"
                                    id="submit_button"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="credit">
                        <h3>&copy;PaluGada 2023 | All Rights reserved.</h3>
                    </div>
                </div>
            </section>
        </footer>
    );
}
