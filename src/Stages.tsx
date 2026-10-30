import { culturePillars, stages } from "./content";
import type { Choices } from "./journey";
import Workspace from "./Workspace";
import type { PhotoAlbumId } from "./photoAlbums";
import { photoUrl } from "./photoAlbums";
import Activities from "./Activities";
import NewcomerHome from "./components/NewcomerHome";
import type { DocId } from "./documents";
import { siteConfig } from "./siteConfig";
import ContentIcon from "./components/ContentIcon";
import type { ContentIconName } from "./components/ContentIcon";

export type DialogView = DocId | "registration" | "index";
type Props = {
  stage: number;
  choices: Choices;
  choose: <K extends keyof Choices>(field: K, value: Choices[K]) => void;
  open: (view: DialogView, focusSearch?: boolean) => void;
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
};

const values = [
  { title: "Chủ động học hỏi", text: "Tự tìm hiểu, thử làm và hỏi khi cần." },
  { title: "Trách nhiệm & cam kết", text: "Giữ cam kết, gặp khó thì báo sớm." },
  { title: "Chia sẻ & cùng tiến bộ", text: "Chia sẻ điều mình biết, hỗ trợ đồng đội." },
];

export default function Stage({ stage, choices, choose, open, openPhotos }: Props) {
  const stageId = stages[stage].id;
  if (stageId === "identity") return <NewcomerHome openPhotos={openPhotos} />;
  if (stageId === "workspace") return <Workspace selected={choices.folder} onSelect={(index) => choose("folder", index)} openQuestions={() => open("index", false)} />;
  if (stageId === "activities") return <Activities selected={choices.activity} onSelect={(index) => choose("activity", index)} openPhotos={openPhotos} />;

  if (stageId === "culture") return (
    <section className="stage culture-stage newcomer-culture" aria-labelledby="stage-title">
      <header className="reading-heading"><span className="eyebrow">TINH THẦN BCN</span><h1 id="stage-title">Cùng nhau tiến bộ.</h1></header>
      <div className="values-grid">
        {culturePillars.map((item, index) => <article className="value-card" key={item.title}>
          <img src={photoUrl(item.photo)} alt="" style={{ objectPosition: item.photoPosition }} decoding="async" loading="lazy" />
          <div><h2><ContentIcon name={(["spark", "shield", "people"] as ContentIconName[])[index]} />{values[index].title}</h2><p>{values[index].text}</p></div>
        </article>)}
      </div>
      <div className="section-tools"><button className="text-action" onClick={() => open("expectations")}>Điều kiện & thời gian <span aria-hidden="true">↗</span></button></div>
    </section>
  );

  return (
    <section className="stage commit-stage newcomer-join" aria-labelledby="stage-title">
      <div className="join-layout">
        <div className="commit-content join-intro">
          <span className="eyebrow">THAM GIA BAN CÔNG NGHỆ</span>
          <h1 id="stage-title">Hẹn bạn <span>ở BCN.</span></h1>
          <dl className="join-facts"><div><dt>Dành cho</dt><dd>Sinh viên khoa CNTT, IUH</dd></div></dl>
        </div>
        <figure className="join-community-photo"><img src={photoUrl("BCN_Train04.jpg")} alt="Hai thành viên cùng trao đổi và giải thích ý tưởng trên bảng." width="2048" height="1536" /><figcaption>Cùng trao đổi, cùng tìm cách làm.</figcaption></figure>
        <aside className="join-next" aria-labelledby="join-next-title">
          <span className="status-label"><span className="status-dot" aria-hidden="true" /> K23 · Chờ thông báo tuyển</span>
          <h2 id="join-next-title">Theo dõi đợt tuyển K23.</h2>
          <p className="join-status-copy">K22 đã khép lại. Lịch, điều kiện và các vòng tuyển K23 chưa chốt.</p>
        </aside>
      </div>
      <div className="section-tools"><button className="text-action" aria-label="Điều kiện & lịch sinh hoạt" onClick={() => open("registration")}>Điều kiện & lịch <span aria-hidden="true">↗</span></button><button className="text-action" aria-label="Ấn phẩm các mùa tuyển trước" onClick={() => openPhotos("recruitment")}>Ấn phẩm tuyển cũ <span aria-hidden="true">↗</span></button></div>
    </section>
  );
}
