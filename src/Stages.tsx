import { useRef, useState } from "react";
import {
  culturePillars,
  entryProcess,
  identityViews,
  profiles,
  stageIndex,
  stages,
} from "./content";
import type { Choices } from "./journey";
import BootButton from "./components/BootButton";
import BootBackground from "./components/BootBackground";
import Workspace from "./Workspace";
import type { PhotoAlbumId } from "./photoAlbums";
import { photoUrl } from "./photoAlbums";
import Activities from "./Activities";
import IdentityCarousel from "./components/IdentityCarousel";
import CommitGallery from "./components/CommitGallery";
import SyncBackground from "./components/SyncBackground";
import { identityDocIds } from "./documents";
import type { DocId } from "./documents";
import { useCultureLayout } from "./useCultureLayout";

export type DialogView = DocId | "registration" | "index";
type Props = {
  stage: number;
  choices: Choices;
  choose: <K extends keyof Choices>(field: K, value: Choices[K]) => void;
  go: (stage: number) => void;
  open: (view: DialogView) => void;
  settle: () => void;
  openPhotos: (album: PhotoAlbumId, index?: number) => void;
};

export default function Stage({
  stage,
  choices,
  choose,
  go,
  open,
  settle,
  openPhotos,
}: Props) {
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [pillar, setPillar] = useState<number | null>(null);
  const [cultureDetail, setCultureDetail] = useState(false);
  const [cultureTip, setCultureTip] = useState(0);
  const cultureGrid = useRef<HTMLDivElement>(null);
  useCultureLayout(cultureGrid, pillar, cultureDetail, cultureTip);
  const stageId = stages[stage].id;
  if (stageId === "boot")
    return (
      <section className="stage boot-stage" aria-labelledby="stage-title">
        <BootBackground />
        <div className="boot-content">
          <div className="terminal-log mono">
            <span>&gt; Establishing connection…</span>
            <span>
              &gt; Loading your next beginning<span className="cursor">_</span>
            </span>
          </div>
          <h1 id="stage-title">
            KHÁM PHÁ
            <br />
            <span>HỆ THỐNG</span>
          </h1>
          <p className="mono boot-description">
            Không chỉ là code. Đây là một cộng đồng thực chiến.
          </p>
          <BootButton onBoot={() => go(stageIndex("identity"))} />
          <button className="boot-index mono" onClick={() => open("index")}>
            [ 7 CÂU HỎI ĐỂ HIỂU BCN ] <span>↗</span>
          </button>
        </div>
        <span className="boot-signature mono">
          BAN CÔNG NGHỆ / DISCOVER → REGISTER → TRY → COMMIT
        </span>
      </section>
    );

  if (stageId === "identity")
    return (
      <section className="stage identity-stage" aria-labelledby="stage-title">
        <IdentityCarousel>
          <span className="outlined-tag mono">02 / CORE IDENTITY</span>
          <h1 id="stage-title">
            HỌC. <br />
            LÀM THẬT. <br />
            TRƯỞNG THÀNH.
          </h1>
          <p className="mono">
            KHÔNG CHỈ LÀ CODE.
            <br />
            LÀ MỘT MÁI NHÀ CHUNG.
          </p>
        </IdentityCarousel>
        <div className="identity-white">
          <div
            className="identity-tabs"
            role="group"
            aria-label="Khám phá bản sắc"
          >
            {identityViews.map((item, index) => (
              <button
                key={item.label}
                aria-pressed={choices.identity === index}
                onClick={() => choose("identity", index)}
              >
                {item.label}
              </button>
            ))}
            <span
              className="identity-tab-indicator"
              aria-hidden="true"
              style={{ transform: `translateX(${choices.identity * 100}%)` }}
            />
          </div>
          <div className="identity-content" aria-live="polite">
            {identityViews.map((item, index) => (
              <div
                className={`identity-panel ${choices.identity === index ? "is-active" : ""}`}
                key={item.label}
                aria-hidden={choices.identity !== index}
                inert={choices.identity !== index}
              >
                <span className="content-label mono">{item.tag}</span>
                <h2>{item.title}</h2>
                <p className="body-copy">{item.text}</p>
                <p className="identity-note mono">{item.note}</p>
                <button
                  className="inline-link mono"
                  onClick={() => open(identityDocIds[choices.identity])}
                >
                  {["ĐỌC VỀ BCN", "ĐỌC 5 SỨ MỆNH", "ĐỌC TẦM NHÌN"][index]}{" "}
                  <span>↗</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );

  if (stageId === "culture")
    return (
      <section className="stage culture-stage" aria-labelledby="stage-title">
        <button
          className={`marquee ${marqueePaused ? "marquee-paused" : ""}`}
          aria-label={
            marqueePaused
              ? "Tiếp tục dòng chữ văn hóa"
              : "Tạm dừng dòng chữ văn hóa"
          }
          aria-pressed={marqueePaused}
          title="Chạm để tạm dừng hoặc tiếp tục"
          onClick={() => setMarqueePaused(!marqueePaused)}
        >
          <div className="marquee-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span className="marquee-group" key={copy}>
                {[0, 1].map((repeat) => (
                  <span key={repeat}>
                    THÁI ĐỘ QUAN TRỌNG HƠN XUẤT PHÁT ĐIỂM • KHÔNG SỢ SAI, CHỈ SỢ
                    KHÔNG DÁM THỬ • CÙNG NHAU TIẾN BỘ •{" "}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </button>
        <div className="stage-heading">
          <h1 id="stage-title">VĂN HÓA BCN</h1>
          <span className="mono">NÓI RÕ. NÓI THẬT. ĐÚNG LÚC. VĂN MINH.</span>
        </div>
        <div
          className="culture-grid"
          ref={cultureGrid}
          data-open={pillar !== null}
          data-active={pillar ?? ""}
          role="group"
          aria-label="Các trụ cột văn hóa"
        >
          {culturePillars.map((item, index) => {
            const expanded = pillar === index;
            return (
              <article
                className={`culture-column ${expanded ? "is-open" : ""}`}
                key={item.title}
              >
                <div className="culture-scene" aria-hidden="true">
                  <div className="culture-photo">
                    <img
                      src={photoUrl(item.photo)}
                      alt=""
                      style={{ objectPosition: item.photoPosition }}
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                  <div className="culture-photo-shade" />
                  <svg
                    className="culture-trace"
                    viewBox="0 0 400 400"
                    fill="none"
                  >
                    {index === 0 ? (
                      <>
                        <path d="M60 320V240H140V160H220V80H340M280 20L340 80L280 140" />
                        <circle cx="60" cy="320" r="8" />
                        <circle cx="220" cy="160" r="8" />
                      </>
                    ) : index === 1 ? (
                      <>
                        <path d="M140 80L40 200L140 320M260 80L360 200L260 320M230 40L170 360" />
                        <circle cx="40" cy="200" r="8" />
                        <circle cx="360" cy="200" r="8" />
                      </>
                    ) : (
                      <>
                        <path d="M80 100L320 100L200 310ZM80 100L200 190L320 100M200 190V310" />
                        <circle cx="80" cy="100" r="20" />
                        <circle cx="320" cy="100" r="20" />
                        <circle cx="200" cy="310" r="20" />
                        <circle cx="200" cy="190" r="8" />
                      </>
                    )}
                  </svg>
                  <span className="culture-scene-frame" />
                  <span className="culture-scene-signal" />
                </div>
                <h2 className="culture-column-heading">
                  <button
                    className="culture-toggle"
                    id={`culture-toggle-${index}`}
                    aria-label={item.title.replace("\n", " ")}
                    title={item.title.replace("\n", " ")}
                    aria-expanded={expanded}
                    aria-controls={`culture-panel-${index}`}
                    onClick={() => {
                      setPillar(expanded ? null : index);
                      setCultureDetail(false);
                      setCultureTip(0);
                    }}
                  >
                    <span className="pillar-number mono">0{index + 1}</span>
                    <span className="culture-toggle-title">{item.title}</span>
                    <span className="culture-toggle-arrow" aria-hidden="true">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>
                </h2>
                <div
                  className="culture-panel"
                  id={`culture-panel-${index}`}
                  role="region"
                  aria-labelledby={`culture-toggle-${index}`}
                  hidden={!expanded}
                >
                  {expanded && (
                    <>
                      <div className="culture-reading" aria-live="polite">
                        {cultureDetail ? (
                          <>
                            <div
                              className="principle-selector"
                              role="group"
                              aria-label="Nguyên tắc thực hành"
                            >
                              {item.details.map((_, tip) => (
                                <button
                                  key={tip}
                                  aria-label={`Nguyên tắc ${tip + 1}`}
                                  aria-pressed={cultureTip === tip}
                                  onClick={() => setCultureTip(tip)}
                                >
                                  0{tip + 1}
                                </button>
                              ))}
                            </div>
                            <p className="body-copy">
                              {item.details[cultureTip]}
                            </p>
                          </>
                        ) : (
                          <p className="body-copy">
                            <span className="culture-full-copy">
                              {item.text}
                            </span>
                            <span className="culture-mobile-copy">
                              {item.mobileText}
                            </span>
                          </p>
                        )}
                      </div>
                      <button
                        className="inline-link mono"
                        aria-pressed={cultureDetail}
                        onClick={() => setCultureDetail(!cultureDetail)}
                      >
                        {cultureDetail
                          ? "← Ý CHÍNH"
                          : "TRONG CÁCH CHÚNG MÌNH LÀM ↗"}
                      </button>
                      <div className="culture-command mono">{item.command}</div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <div className="culture-bottom">
          <button
            className="inline-link mono"
            onClick={() => open("expectations")}
          >
            BCN KỲ VỌNG GÌ Ở BẠN? ↗
          </button>
        </div>
      </section>
    );

  if (stageId === "workspace")
    return (
      <Workspace
        folder={choices.folder}
        onFolder={(index) => choose("folder", index)}
        beforeRead={settle}
        openPhotos={openPhotos}
      />
    );

  if (stageId === "activities")
    return (
      <Activities
        selected={choices.activity}
        onSelect={(index) => choose("activity", index)}
        openPhotos={openPhotos}
      />
    );

  if (stageId === "sync")
    return (
      <section className="stage sync-stage" aria-labelledby="stage-title">
        <SyncBackground />
        <div className="sync-content">
          <div className="sync-heading">
            <span className="outlined-tag mono">06 / MINDSET_CHECK</span>
            <h1 id="stage-title">
              VIỆC MỚI.
              <br />
              <span>BẠN BẮT ĐẦU THẾ NÀO?</span>
            </h1>
            <p className="sync-hint">
              Không có một cách bắt đầu duy nhất. Chọn cách gần với bạn nhất.
            </p>
          </div>
          <div
            className="quiz-options"
            role="group"
            aria-label="Chọn cách bạn bắt đầu"
          >
            <span className="quiz-label mono" aria-hidden="true">
              CHỌN MỘT CÁCH TIẾP CẬN / 01 — 03
            </span>
            {profiles.map((profile, index) => (
              <button
                key={profile.id}
                aria-pressed={choices.profile === index}
                onClick={() => {
                  choose("profile", index);
                  go(stageIndex("commit"));
                }}
              >
                <span className="quiz-number mono" aria-hidden="true">
                  0{index + 1}
                </span>
                <span>
                  <strong>{profile.label}</strong>
                  <small className="mono">{profile.sub}</small>
                </span>
                <span className="quiz-arrow">↗</span>
              </button>
            ))}
          </div>
          <div className="sync-expectation">
            <div>
              <p>
                Chủ động học. Có trách nhiệm. Giữ cam kết. Cùng nhau tiến bộ.
              </p>
            </div>
            <button className="mono" onClick={() => open("expectations")}>
              XEM CAM KẾT ↗
            </button>
          </div>
        </div>
      </section>
    );

  const profile = choices.profile === null ? null : profiles[choices.profile];
  return (
    <section className="stage commit-stage" aria-labelledby="stage-title">
      <div className="commit-content">
        <span className="outlined-tag mono">
          {profile
            ? `MINDSET: ${profile.tag}`
            : "SYSTEM.READY / YOUR NEXT CHAPTER"}
        </span>
        <h1 id="stage-title">
          ĐÃ ĐẾN LÚC
          <br />
          <span>GÕ CỬA BCN.</span>
        </h1>
        <p className="commit-personal">
          {profile?.title.replace("\n", " ") ||
            "Một cộng đồng thực hành. Một khởi đầu có thể là của bạn."}
        </p>
        <p className="body-copy">
          {profile?.reply ||
            "Mang theo sự tò mò, chủ động và trách nhiệm. Sẵn sàng thử sức cùng BCN?"}
        </p>
        <button className="join-button" onClick={() => open("registration")}>
          ĐĂNG KÝ THAM GIA <span>↗</span>
        </button>
        <div
          className="process-row"
          role="list"
          aria-label="Hành trình gia nhập dự kiến"
        >
          {entryProcess.map((step, index) => (
            <div role="listitem" key={step.name}>
              <span className="mono">0{index + 1}</span>
              <strong>{step.name}</strong>
            </div>
          ))}
        </div>
        <button className="inline-link mono" onClick={() => open("process")}>
          LỘ TRÌNH GIA NHẬP DỰ KIẾN ↗
        </button>
        <button
          className="commit-change mono"
          onClick={() => go(stageIndex("sync"))}
        >
          ← CHỌN LẠI ĐIỂM CHUNG
        </button>
      </div>
      <CommitGallery />
    </section>
  );
}
