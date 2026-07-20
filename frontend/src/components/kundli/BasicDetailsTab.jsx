import { SectionCard, InfoGrid } from "./shared";

export default function BasicDetailsTab({ kundli }) {
  const { person, moonDetails, sunDetails, ascendant, panchang, moonAttrs, numerology } = kundli;

  const basicRows = [
    { label: "Name", value: person.name },
    { label: "Nakshatra", value: moonDetails.nakshatra },
    { label: "Birth Date & Time", value: person.birthDisplay },
    { label: "Ascendant", value: ascendant.sign },
    { label: "Birth Place", value: person.place },
    { label: "Moon Sign", value: moonDetails.sign },
    { label: "Gender", value: person.gender },
    { label: "Sun Sign", value: sunDetails.sign },
  ];

  const kundliDetailRows = [
    { label: "Nakshatra Lord", value: moonDetails.nakshatraLord },
    { label: "Charan (Pada)", value: moonDetails.pada },
    { label: "Yog", value: panchang.yoga },
    { label: "Karan", value: panchang.karan },
    { label: "Tithi", value: panchang.tithi },
    { label: "Name Alphabet", value: moonAttrs.nameAlphabet },
    { label: "Tatva", value: moonAttrs.tatva },
    { label: "Gan", value: moonAttrs.gan },
    { label: "Paya", value: moonAttrs.paya },
    { label: "Nadi", value: moonAttrs.nadi },
    { label: "Varna", value: moonAttrs.varna },
    { label: "Vashya", value: moonAttrs.vashya },
    { label: "Sign Lord", value: moonDetails.signLord },
    { label: "Yoni", value: moonAttrs.yoni },
  ];

  const favourableRows = [
    { label: "Name", value: person.name },
    { label: "Date", value: person.birthDisplayDateOnly },
    { label: "Destiny Number", value: numerology.destinyNumber },
    { label: "Name Number", value: numerology.nameNumber },
    { label: "Radical Number", value: numerology.radicalNumber },
    { label: "Radical Ruler", value: numerology.radicalRuler },
    { label: "Lucky Color", value: numerology.profile.color },
    { label: "Lucky Day", value: numerology.profile.day },
    { label: "Lucky God", value: numerology.profile.god },
    { label: "Lucky Metal", value: numerology.profile.metal },
    { label: "Lucky Stone", value: numerology.profile.stone },
    { label: "Lucky Mantra", value: numerology.profile.mantra },
    { label: "Friendly Number", value: numerology.profile.friendly },
    { label: "Neutral Number", value: numerology.profile.neutral },
    { label: "Evil Number", value: numerology.profile.evil || "None" },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Basic Details">
        <InfoGrid rows={basicRows} />
      </SectionCard>
      <SectionCard title="Kundli Details">
        <InfoGrid rows={kundliDetailRows} />
      </SectionCard>
      <SectionCard title="Favourable">
        <InfoGrid rows={favourableRows} />
      </SectionCard>
    </div>
  );
}
