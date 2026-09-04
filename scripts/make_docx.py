#!/usr/bin/env python3
"""Minimal OOXML writer for sample parish documents."""

from __future__ import annotations

import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

CONTENT_TYPES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
"""

RELS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>
"""

NS = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {body}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/></w:sectPr>
  </w:body>
</w:document>
"""


def paragraph(text: str, *, bold: bool = False, size: int = 24, center: bool = False) -> str:
    rpr = f'<w:rPr><w:sz w:val="{size}"/>{"<w:b/>" if bold else ""}</w:rPr>'
    jc = "<w:jc w:val=\"center\"/>" if center else ""
    return (
        f"<w:p><w:pPr>{jc}</w:pPr><w:r>{rpr}"
        f'<w:t xml:space="preserve">{escape(text)}</w:t></w:r></w:p>'
    )


def write_docx(path: Path, blocks: list[tuple[str, dict]]) -> None:
    body = "".join(paragraph(text, **opts) for text, opts in blocks)
    path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", CONTENT_TYPES)
        zf.writestr("_rels/.rels", RELS)
        zf.writestr("word/document.xml", NS.format(body=body))


def main() -> None:
    root = Path(__file__).resolve().parents[1] / "content"

    write_docx(
        root / "aktualnosci" / "2026-08-30-ogloszenia-parafialne.docx",
        [
            ("Ogłoszenia parafialne 30 sierpnia 2026 roku", {"bold": True, "size": 36, "center": True}),
            ("Dziś XXII Niedziela Zwykła. Msze św. o godz. 8:00, 10:00 i 14:00.", {"bold": False}),
            (
                "Dzisiejsza kolekta przeznaczona jest na budowę kościoła – na zakup posadzki. "
                "„Bóg zapłać” za złożone dzisiaj ofiary i te wpłacane na konto parafialne. "
                "Kolekta za tydzień na Wydział Teologiczny Uniwersytetu Śląskiego w Katowicach.",
                {},
            ),
            ("Wszystkim wracającym z urlopów życzymy szczęśliwego i bezpiecznego powrotu do domów.", {}),
            (
                "We wtorek, o godz. 8:00 – Msza św. rozpoczynająca Nowy Rok Szkolny i Katechetyczny. "
                "Zapraszamy Dyrekcję Zespołu Szkół Nr 1 i Przedszkola, Grono Pedagogiczne, Katechetów, "
                "dzieci, młodzież, przedszkolaków i rodziców.",
                {},
            ),
            (
                "W czasie Mszy św. poświęcimy przyniesione przez pierwszoklasistów tornistry i „rogi obfitości”. "
                "O godz. 7:30 – Spowiedź św. dla dzieci.",
                {},
            ),
            (
                "W środę, po porannej Mszy św. – Nabożeństwo do Matki Bożej Nieustającej Pomocy "
                "i udzielimy Sakramentu Namaszczenia Chorych.",
                {},
            ),
            (
                "W czwartek przypada I Czwartek Miesiąca. O godz. 18:00 – Msza św. szkolna dla wszystkich dzieci "
                "oraz Msza św. rozpoczynająca nowy rok formacyjny ministrantów, Dzieci Maryi i Scholi. Zapraszamy Was z rodzicami!",
                {},
            ),
            (
                "W piątek przypada I Piątek Miesiąca. O godz. 15:00 – Godzina Miłosierdzia z Koronką. "
                "O godz. 17:00 – Wystawienie Najświętszego Sakramentu i Cicha Adoracja. "
                "O godz. 17:30 – Spowiedź św. uczniów klasy IV z SP 9. O godz. 18:00 – Msza św. "
                "i nabożeństwo do Najświętszego Serca Pana Jezusa.",
                {},
            ),
            ("Kancelaria parafialna czynna w poniedziałek po porannej Mszy św. i w czwartek po Mszy św. wieczornej.", {}),
            ("Życzymy obfitych Łask Bożych płynących od samego Pana Boga!", {"bold": True, "center": True}),
        ],
    )

    write_docx(
        root / "intencje" / "2026-08-30-porzadek-intencji.docx",
        [
            ("Porządek intencji mszalnych 30.08.2026 – 06.09.2026", {"bold": True, "size": 36, "center": True}),
            ("Niedziela 30.08.2026. XXII Niedziela Zwykła", {"bold": True, "size": 28}),
            ("7:30  Różaniec", {}),
            ("8:00  Do Opatrzności Bożej przez wstawiennictwo Matki Bożej Częstochowskiej i św. Wawrzyńca jako podziękowanie za odebrane łaski z prośbą o dalsze zdrowie i Boże błogosławieństwo dla Ireny Dymek z okazji 75-tych urodzin. Te Deum.", {}),
            ("10:00  Za + ojca Stanisława Wajda we wspomnienie urodzin i + matkę Marię.", {}),
            ("14:00  Do Miłosierdzia Bożego przez wstawiennictwo Matki Bożej Nieustającej Pomocy i św. Wawrzyńca w intencji dzieci niepełnosprawnych z Ośrodka RAFA oraz wszystkich dzieci z naszej Parafii z prośbą o zdrowie i Boże błogosławieństwo.", {}),
            ("Poniedziałek 31.08.2026.", {"bold": True, "size": 28}),
            ("7:00  Za ++ syna Konrada w 5-tą rocznicę śmierci, męża Stanisława w 22-gą rocznicę śmierci, ++ rodziców i dusze w czyśćcu cierpiące.", {}),
            ("Wtorek 01.09.2026.", {"bold": True, "size": 28}),
            ("8:00  Rozpoczęcie Roku Szkolnego i Katechetycznego w intencji dzieci, młodzieży i Rodziców oraz Dyrekcji, Grona Pedagogicznego, Wychowawców, Katechetów z Zespołu Szkół Nr 1 oraz Przedszkola.", {}),
            ("18:00  Za + męża Krzysztofa Olejniczaka w 1-szą rocznicę śmierci i syna Tomasza w 18-tą rocznicę śmierci.", {}),
            ("Środa 02.09.2026.", {"bold": True, "size": 28}),
            ("7:00  Przez wstawiennictwo Matki Bożej Patronki Dobrej Śmierci i św. Józefa o szczęśliwą godzinę śmierci.", {}),
            ("Nabożeństwo do Matki Bożej Nieustającej Pomocy. Udzielenie Sakramentu Namaszczenia Chorych.", {}),
            ("Czwartek 03.09.2026. I Czwartek Miesiąca.", {"bold": True, "size": 28}),
            ("18:00  Przez wstawiennictwo Matki Bożej Niepokalanie Poczętej w intencji Dzieci Maryi, ministrantów, Scholi, Animatorów i Rodziców z okazji rozpoczęcia nowego roku formacyjnego.", {}),
            ("Piątek 04.09.2026. I Piątek Miesiąca.", {"bold": True, "size": 28}),
            ("15:00  Godzina Miłosierdzia z koronką", {}),
            ("17:00  Wystawienie Najświętszego Sakramentu", {}),
            ("18:00  Za + Mariana Lisieckiego w kolejną rocznicę śmierci.", {}),
            ("Sobota 05.09.2026. I Sobota Miesiąca", {"bold": True, "size": 28}),
            ("8:00  W intencji czcicieli Niepokalanego Serca Maryi.", {}),
            ("18:00  Za + Marka Karolik we wspomnienie urodzin.", {}),
            ("Niedziela 06.09.2026. XXIII Niedziela Zwykła", {"bold": True, "size": 28}),
            ("8:00  Przez wstawiennictwo Matki Bożej Sprawiedliwości i Miłości Społecznej jako podziękowanie za trud pielgrzymowania do Piekar.", {}),
            ("10:00  Za + Andrzeja Szczypińskiego.", {}),
            ("14:00  Do Miłosierdzia Bożego w intencji dzieci niepełnosprawnych z Ośrodka RAFA oraz wszystkich dzieci z naszej Parafii.", {}),
            ("15:30  Za + Jacka Pet – od rodziny Mularczyk i Muczyń.", {}),
        ],
    )

    print("Wrote sample DOCX files.")


if __name__ == "__main__":
    main()
