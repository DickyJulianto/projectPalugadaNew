export default function HomeSection() {
    return (
        <section className="home" id="home">
            <div className="content">
                <h1>
                    Jasa Game Boosting Tepercaya <br /> Yang Serba Bisa
                </h1>
                <img src="/assets/images/underline.png" alt="underline" />
                <p>
                    penyedia layanan game boosting bergaransi dan tepercaya yang
                    bisa apa aja! <br /> auto winstreak, WinRate naik jadi makin
                    #GGWP
                </p>
                <a href="#about">
                    <button>Learn More</button>
                </a>
            </div>
            <div className="box_container">
                <div className="box">
                    <i className="fa-solid fa-gamepad"></i>
                    <h3>Game Boosting</h3>
                    <p>
                        menerima berbagai jasa GB dari WinRate,joki ranked,
                        hingga Item Grinding dari berbagai game
                    </p>
                </div>
                <div className="box">
                    <i className="fa-solid fa-money-bill-trend-up"></i>
                    <h3>
                        Top-Up <br />
                        Voucher In-Game
                    </h3>
                    <p>
                        cuma disini yang sediain Top-Up murah, dan mudah untuk
                        game favorit kamu
                    </p>
                </div>
                <div className="box">
                    <i className="fa-solid fa-trophy"></i>
                    <h3>joki ranked</h3>
                    <p>
                        satu-satunya jasa joki ranked <br /> yang berani kasih
                        garansi untuk dijokiin sampe rank tujuan kamu!
                    </p>
                </div>
            </div>
        </section>
    );
}