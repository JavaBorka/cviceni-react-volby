# Komunikace dítě - rodič a naopak

V předchozích lekcích už jsme se naučili téměř všechno, co v Reactu potřebujeme k vývojí opravdových webových aplikací. Dostáváme se tedy do bodu, kdy postupně začneme stavět rozsáhlejší aplikace se stále větším množstvím komponent. Brzy tak narazíme na situaci, kdy si budeme potřebovat předávat informace mezi různými komponentami. Způsob, jakým si komponenty budou předávat informace bude záviset na tom, jaký spolu mají vztah. V podstatě máme tři základní možnosti.

Komunikace rodič → dítě
Komunikace dítě → rodič
Komunikace mezi sourozenci
(Češtinářská perlička – sice v komunikaci vystupují „rodič“ a „dítě“, ale když chceme označit komponentu, neříkáme jí „dětská komponenta“ nýbrž „dceřiná komponenta“.)

V této lekci rozebereme první dvě možnosti a třetí si necháme do další lekce. K ilustraci komunikace mezi komponentami použijeme jednoduchou webovou aplikaci, ve které si budeme hrát na prezidentské volby. Vytvořte si repozitář ze šablony cviceni-volby. Repozitář si naklonujeme a prohlédneme si jeho strukturu.

Naše volební aplikace zobrazuje čtyři kandidáty pomocí komponenty Candidate. Pole obsahující jména a podobizny kandidátů najdeme ve stavu komponenty App. Tato data bychom normálně stáhli odněkud ze serveru. V tomto případě si život malinko ulehčíme a obsah stavu zadrátujeme přímo do kódu.

Z kódu můžeme vyčíst, že komponenta App používá komponenty Candidate. Budeme tedy říkat, že App je takzvaný rodič a komponenty Candidate jsou její děti.

# Komunikace rodič → dítě

Předávání informací směrem od rodiče k dítěti je z našich tří situací nejjednodušší a už jsme ji dokonce mnohokrát viděli. Tato komunikace totiž probíhá předáváním hodnot skrze props.

V našem příkladu s volbami vidíme, že komponenta App předává pomocí props data komponentám Candidate.

V našem případě tečou data směrem z komponenty App do komponenty Candidate pomocí dvou props name a avatar.

# Komunikace dítě → rodič

Nyní bychom chtěli zařídit, aby se uživatelem vybraný kandidát zobrazil vedle obrázku hradu. Jakmile tedy uživatel vybere nějakého kandidáta v některé z komponent Candidate, potřebujeme jeho jméno poslat „nahoru“ rodičovské komponentě App, aby si jej tato mohla uložit do stavu president.

Zde však narážíme na zásadní problém. Komponenta Candidate nemá nejmenší tušení, kdo je její rodič. Zevnitř této komponenty tato informace není nijak dostupná. Musíme si tedy pomoct malým trikem.

# Callbacky

Náš trik bude spočívat v tom, že komponentě Candidate skrze props předáme takzvaný callback. Tímto pojmem se v JavaScriptu často označuje funkce, kterou někomu předáváme proto, aby ji tento někdy později zavolal. Anglický název tohoto pojmu vzniká právě ze slovního spojení "zavolat zpátky", tedy "call back".

S callbacky už jsme se ve skutečnosti setkali dávno, jen jsme jim tehdy říkali posluchače událostí. Každý posluchač události je ve skutečnosti callback. Tlačítku button například předáváme funkci, která se má zavolat (call back) ve chvíli, kdy na tlačítko klikneme. V minulé lekci jste viděli, že v Reactu se takové věc zařídí poměrně jednoduše.

const SensitiveButton = (props) => {
  const handleClick = () => {
    console.log('Au');
  };

  return <button onClick={handleClick}>{props.caption}</button>;
};

# Použití callbacků ke komunikaci

V našem příkladu však callback nebudeme používat k poslouchání událostí. Budeme jej volat sami zevnitř komponenty Candidate ve chvíli, kdy chceme rodiči předat jméno zvoleného kandidáta.

Nejprve tedy přidáme do komponenty Candidate novou prop s názvem onVote. Abychom dali najevo, že do této prop budeme posílat funkci, volíme jméno podobně jako to známe u událostí, tedy onClick, onMouseMove apod. Jménem chceme naznačit, že tuto funkci zavoláme ve chvíli, kdy uživatel zahlasuje (anglicky vote) pro daného kandidáta.

const Candidate = ({ name, avatar, onVote }) => ( … )
Nyní potřebujeme funkci onVote zavolat se jménem kandidáta ve chvíli, kdy uživatel klikne na tlačítko. Použijeme tedy událost onClick a naše výsledná komponenta bude vypadat takto.

const Candidate = ({ name, avatar, onVote }) => (
  <div className="candidate">
    <h3 className="candidate__name">{name}</h3>
    <img className="candidate__avatar" src={avatar} />
    <button
      className="btn-vote"
      onClick={() => {
        onVote(name);
      }}
    >
      Vybrat
    </button>
  </div>
);

Na straně komponenty Candidate máme hotovo. Nyní potřebujeme vyřešit komponentu App. V té si vytvoříme funkci (callback), kterou budeme posílat do prop onVote. Pokud prop začíná slovíčkem on, je zvykem příslušný callback začínat slovíčkem handle. Náš callback se tedy bude jmenovat handleVote a bude mít jeden parametr name. To bude jméno kandidáta, na kterého uživatel kliknul. Toto jméno nastavíme jako příslušný stav v komponentě App.

const handleVote = (name) => {
  setPresident(name);
};

Tento callback pak předáme všem komponentám Candidate.

const App = () => {
  const [candidates, setCandidates] = useState([]);
  const [president, setPresident] = useState(null);

  useEffect(
    () =>
      setCandidates([
        { name: 'Ferdinand Mravenec', avatar: '/assets/candidate01.png' },
        { name: 'Markéta Smetana', avatar: '/assets/candidate02.png' },
        { name: 'Beáta Skočdopolová', avatar: '/assets/candidate03.png' },
        { name: 'Lubomír Poňuchálek', avatar: '/assets/candidate04.png' },
      ]),
    []
  );

  const handleVote = (name) => {
    setPresident(name);
  };

  return (
    <div className="container">
      <div className="castle">
        <div className="castle__image"></div>
        <div className="castle__body">
          <h1>Nový prezident</h1>
          <p className="castle__president">
            {president === null ? 'Vyberte svého kandidáta' : president}
          </p>
        </div>
      </div>

      <h2>Kandidátí</h2>
      <div className="candidate-list">
        {candidates.map((c) => (
          <Candidate
            key={c.name}
            name={c.name}
            avatar={c.avatar}
            onVote={handleVote}
          />
        ))}
      </div>
    </div>
  );
};

V tuto chvíli už naše aplikace bude správně fungovat.

# Hlubší vysvětlení callbacků

Komunikace pomocí callbacků může za začátku působit děsivě složitě a nepřístupně. Je tedy zapotřebí si v hlavě udělat jasný obrázek o tom, jak tento mechanizmus funguje. Pojďme shrnout, co přesně se děje ve výše uvedeném příkladu.

Rodičovská komponenta App vytváří funkci handleVote a tu posílá skrze prop onVote komponentě Candidate. Dceřinná komponenta Candidate obdrží v prop onVote funkci, kterou zavolá se jménem vybraného kandidáta. Vzhledem k tomu, že v prop onVote je funkce handleVote vytvořená rodičem, komponenta Candidate tak propašuje do rodiče název zvoleného kandidáta.

Komunikace od rodiče k dítěti probíhá skrze props a komunikace od dítěte k rodiči probíhá skrze callbacky.