export default function AboutSection() {
    return (
        <section className="about" id="about">
            <h1 className="heading">Mau Ranked, Malah Rungkad?</h1>
            <div className="row">
                <div className="content">
                    <h3>Jokiin di PaluGada Auto winstreak!</h3>
                    <p>
                        cape solo ranked dan ketemu tim troll yang bikin stuck
                        di rank itu-itu aja? Palugada hadir buat bantu berbagai
                        permasalahan kalian. mulai dari game Boosting, Joki
                        Ranked, broadcasting, design grafis, bahkan servis
                        kulkas kami lakuin!{" "}
                    </p>
                    <a href="#contact">
                        <button>Learn More</button>
                    </a>
                </div>
                <div className="image">
                    <img src="/assets/images/about-img.png" alt="about_img" />
                </div>
            </div>
        </section>
    );
}