# NOTES: Chí Hiển's Folio

## Innovation & Research (IAR) — hoàn thành (2026-10-09)

- **Chữ 4 pop-up** chép nguyên văn người dùng gửi (lưu `figma-export/iar/text.md`), đối chiếu 4 ref.
- **Other research**: 2 khối, mỗi khối tiêu đề **gạch chân** + 1 câu (dùng `heading`+`underline`).
  Tiêu đề: "Research at Hanoi University of Science and Technology" / "Research at 13th Vietnam
  Summer School of Science".
- **Sửa lỗi vị trí ảnh** (đo lại từ ref):
  - `wico-2` (huy chương + Gold Award): {x:1120,y:750,w:302,h:445} dọc-dưới →
    **{x:1128,y:446,w:408,h:293}** ngang bên phải ảnh booth (ref 33-77). Nới thẻ kính WICO
    rộng khớp ref: w 1120 → **1215**.
  - `other`: cert (`other-2`) bên TRÁI {x:86,y:398,w:466,h:312}, ảnh nhóm (`other-1`) bên PHẢI
    {x:571,y:398,w:442,h:312} — cạnh nhau (ref 33-97). Trước đây đặt sai (one x:570, one x:85 y:720).
    Lưu ý: `other-1` = ảnh nhóm, `other-2` = giấy chứng nhận (ngược mô tả cũ ở EXPORT.md).
  - tekmonk, vsic: 2 ảnh cạnh nhau, khung phiên trước đã khớp ref (giữ nguyên).
- Base + hover 4 đồ vật chạy đúng (crossfade sang đúng frame); 4 hotspot + 6 nav; không placeholder.

### Vấn đề đã biết của IAR (cần bạn quyết)
1. **Cột đo nước giữ khung giới thiệu khi hover/mở WICO**: ảnh hover cột là ghép từ `iar-base`
   (có intro), Figma không có frame sạch. Nên khi mở WICO, khung giới thiệu top-left vẫn hiện
   (các hover khác thì ẩn). `npm run assets` cảnh báo điều này — đã biết, chấp nhận trừ khi muốn xử lý.
2. **"here" trong Other research** là link gạch chân trong thiết kế, hiện **render chữ thường**
   (chưa có URL, chưa hỗ trợ gạch chân inline). Tiêu đề thì đã gạch chân. Có thể thêm nếu bạn muốn.
3. **base `32:475` vs hover `33:x` lệch nhẹ ở viền** (cảnh báo `npm run assets`: posters 1921đ,
   robot 2560đ, laptop 81đ ngoài vùng object): hai "họ" frame vẽ hơi khác (đường viền vàng-lục của
   base), có thể gây nhấp nháy rất nhẹ khi crossfade. Cosmetic. Nếu cần sạch tuyệt đối, xuất lại
   base + 3 hover từ cùng một bản Figma.
4. **WICO ↔ cột đo nước là phỏng đoán** (pop-up WICO 33:77 trong Figma không có đồ vật nào sáng;
   đoán theo nội dung "water testing device"). Xem mục cũ bên dưới.

## Community Services — hoàn thành (2026-10-09)

- **Chữ 7 pop-up**: chép nguyên văn người dùng gửi trong chat (lưu `figma-export/community/text.md`),
  đối chiếu 7 ref. Mỗi pop-up = tiêu đề + 1 đoạn + ảnh (không heading/bullet như Robotics).
- Giữ dấu gạch ngang "–" (U+2013) ở Zero-Dong, dấu nháy thẳng, dấu gạch nối "first-hand",
  "up-and-coming", "solar-powered", "tourism-based". "Ba Vi"/"Ban Lien"/"Lao Cai" không dấu
  đúng như người dùng gõ.
- **Cerebral Palsy**: tiêu đề 2 dòng — "Cerebral Palsy Family" / "Association Vietnam" (`\n`).
- **Sửa lỗi vị trí ảnh** (khung phiên trước ước lượng bằng mắt, đo lại từ ref):
  - `zerodong-2` (giấy chứng nhận): {x:1279,y:828,w:305,h:441} dọc-dưới → **{x:1292,y:526,w:520,h:303}**
    ngang bên phải ảnh hội chợ (ref 25-285).
  - `advisor-1` (giấy chứng nhận): {x:85,y:746,w:411,h:589} dọc-thấp → **{x:86,y:360,w:653,h:374}**
    ngang ngay dưới chữ (ref 26-420).
  - 5 pop-up còn lại (racetrack, beacon, humanitas, bavi, cerebral): 2 ảnh cạnh nhau, khung
    phiên trước đã khớp ref (lệch ≤ ~30px, giữ nguyên). Đã kiểm mọi ảnh nằm trong thẻ kính (DOM).
- Đã chạy `npm run assets -- community`: 7 frame hover đều qua kiểm tra (nền khớp, không còn
  khung giới thiệu). Base + hover + 7 hotspot + 6 nav chạy đúng; không có khung giữ chỗ.

## Robotics — hoàn thành nội dung pop-up (2026-10-09)

- **Chữ pop-up**: chép nguyên văn từ người dùng gửi trong chat ngày 2026-10-09
  (lưu lại ở `figma-export/robotics/text.md`), đối chiếu ref `6-117` / `6-212` / `6-237`.
  Giữ nguyên dấu câu và dấu nháy thẳng `'` như Sports. Không sửa, không dịch.
- **Dấu đầu dòng**: dấu `*` người dùng gõ = dấu `•` trong thiết kế. Đã quyết:
  - GART: dấu `•` đứng trước dòng tiêu đề ("• GART Expo 2025 / 2026"), đoạn chữ không có `•`.
    Người dùng không gõ `•` cho GART nhưng ref có, nên thêm theo ref.
  - Community Events, Competitions: dấu `•` treo lề ở đầu đoạn chữ (dòng cuộn thẳng hàng
    với chữ sau dấu chấm).
- **Gạch chân tiêu đề**: chỉ Community Events gạch chân hai dòng tiêu đề (xác nhận bằng ref
  6-212). GART và Competitions **không** gạch chân (xác nhận bằng ref 6-117 / 6-237).
- **Mở rộng model dùng chung** (không ảnh hưởng Sports): thêm vào `PopupText` các trường
  tùy chọn `heading` / `underline` / `headingBullet` / `bullet`; thêm `.popup__u`
  (gạch chân) và `.popup__bullet` (treo lề 1.1em) trong `Room.css`; helper `PopupTextBlock`
  trong `Room.tsx` dùng chung desktop + compact. Đoạn chữ không có các trường này
  vẫn render `<p className="popup__body">` y như cũ → Sports giữ nguyên (đã kiểm tra lại).
- **Bố cục**: giữ nguyên các khung (glass/title/ảnh/text) đã dựng sẵn từ phiên trước
  (đo từ Figma). Đã đo chiều cao chữ render ở khổ 1920 để chắc không tràn/đè ảnh.
  Các ô sát mép (đúng như ref vốn sát): cột phải GART còn ~29px, Competitions trên ~12px,
  Competitions dưới ~3px trước ảnh. Nếu sau này đổi cỡ chữ cần kiểm lại ba chỗ này.
- **Cột giữa IMG_3705**: để tĩnh, không có ô hover (theo brief).
- Đã chạy `npm run assets -- robotics`: 3 frame hover đều qua kiểm tra
  (nền khớp ảnh gốc, không còn khung giới thiệu). Ảnh nặng nhất `robotics-base-2x` 208KB.

## Robotics — Competitions 2 trang + sửa lỗi vị trí (2026-10-09, lần 2)

- **Competitions có 2 trang** (người dùng báo: 2 chấm = 2 trang). Trang 2 Figma **không có frame**
  nên dựng theo mẫu trang 1; nội dung + 4 ảnh (`competitions-p2-1..4`) người dùng gửi, chép nguyên văn
  (lưu `figma-export/robotics/text.md`). Dấu nháy "New Year’s" dùng ’ (U+2019) đúng như người dùng gõ.
- **Phân trang thật**: hai chấm (`competitions-dot-1` = đầy/đang xem, `competitions-dot-2` = rỗng)
  nay là nút bấm lật trang; chạm vuốt ngang cũng lật (ngưỡng 40px). Thêm vào model:
  `Popup.pages` (các trang bổ sung) + `Popup.dots` (PopupDots), component `Dots` + state `page`
  trong `Room.tsx`, CSS `.popup__dots/.popup__dot`. Dùng chung desktop + compact. Pop-up một trang
  (GART, Events, Sports) không đổi.
- **Sửa lỗi vị trí ảnh** (khung của phiên trước là ước lượng bằng mắt, không lấy từ Figma vì
  `fetch-figma.mjs` chỉ có config `sports`): hai giấy chứng nhận đặt quá thấp nên lòi khỏi thẻ kính.
  Đo lại từ ref:
  - `gart-2`: {x:765,y:751,w:256,h:355} → **{x:746,y:489,w:365,h:263}** (ref 6-117).
  - `events-4`: {x:1392,y:933,w:260,h:363} → **{x:1444,y:659,w:398,h:285}** (ref 6-212).
  Đã kiểm tra mọi ảnh pop-up Robotics nằm trong thẻ kính (đo bằng DOM).
- Trang 2 dựng theo mẫu trang 1 nên vị trí ảnh/text là **ước lượng** (không có frame Figma để đo):
  3 ảnh khối trên ở y:307 (x:138/448/758, 292×197), poster khối dưới {x:138,y:656,w:325,h:230},
  chấm ở {x:138,y:904}. Nếu designer muốn khác, chỉnh ở `src/rooms/robotics.ts`.

## Chìa khóa chuyển động liên tục — bản local tiếp theo

- Giữ nguyên chuyển động đã duyệt của vợt/giày. Chìa khóa (id nội bộ vẫn là
  `whistle`) nay dùng cùng transform 560ms và glow opacity 460ms.
- Repo không có sprite chìa khóa riêng. `SportsKey.tsx` dùng SVG clipPath
  lấy đúng phần chìa khóa trong ảnh gốc 2x, giữ ổ khóa cam ở vị trí cũ.
  Chỉ phần nền bị chìa khóa cũ che được phục dựng bằng các mảng màu SVG.
- Không crossfade frame hover chìa khóa nữa. Khi mở Swimming, chìa khóa
  vẫn nằm dưới thẻ kính; vợt/giày vẫn nằm trên thẻ kính của chúng.
- Test kiểm tra chuyển động của cả ba món, đổi chiều giữa chừng, không có
  ảnh hover lớn chồng lên, hit area, pop-up, chạm và transition duration 0.

## Chuyển động nổi lên mềm hơn — bản local tiếp theo

- Vợt và giày không còn hòa trộn hai ảnh full-frame có kích thước khác nhau.
  `SportsLift.tsx` dùng đúng hai sprite xuất từ Figma sẵn trong repo, chuyển
  transform liên tục 560ms với easing `cubic-bezier(.22,.61,.36,1)`.
- Tách quầng sáng trắng bằng SVG filter; ảnh thân đồ vật luôn hiện, quầng sáng
  đổi opacity trong 460ms. Không đổi transform của vùng nhận chuột.
- Dựng lại các mảng nền xanh phẳng sau vợt/giày bằng bốn polygon SVG; những
  phần minh họa còn lại dùng ảnh gốc. Đây là phần nền được tái dựng, không phải
  một bản export nền riêng từ Figma.
- Ảnh có nội dung giới thiệu được che bằng đúng vùng tương ứng của frame
  không có giới thiệu. Cái còi tiếp tục dùng crossfade; hai frame hover vợt/giày
  luôn có opacity 0 nên không thể xuất hiện viền đồ vật thứ hai.
- Pop-up dùng lại sprite đang chuyển động ở lớp trên, không thêm bản sao
  lớn ngay khi click. Reduced motion vẫn dùng quy tắc CSS chung.

## Sửa hover bị giật (2026-10-08)

Phần này thay thế mô tả xếp lớp/`data-held` ở mục “Làm mượt chuyển động” bên dưới.

- Lỗi cũ: ảnh gốc có `z-index: 2`, ảnh hover khi rời chuột mất z-index,
  còn ảnh `data-held` chỉ có `z-index: 1`. Cả hai bị ảnh gốc che ngay lập tức.
- Nhóm ảnh nay có thứ tự cố định, cô lập với pop-up. `plus-lighter` cộng các
  trọng số opacity; tổng luôn bằng 1 để không lóe nền/đổi độ sáng giữa hai hover.
- `useFrameCrossfade` lấy opacity đang hiển thị trước khi hủy animation cũ,
  rồi chạy tất cả ảnh trên cùng timeline, giữ 300ms/ease-out từ CSS. Đổi hướng
  giữa chừng vẫn tiếp tục từ hình đang thấy, không ép ảnh cũ về opacity 1.
- Bỏ timer giữ ảnh 300ms; giữ grace 80ms khi rời đồ vật. Vùng nhận chuột mở
  rộng bao cả khung gốc và khung hover, không chạy transform theo animation.
- Tôn trọng reduced motion, kể cả khi đổi tùy chọn lúc animation đang chạy.
- Kiểm thử trình duyệt: xem `tests/README.md`.

Figma file `93v05w3au1CsDYzL4cAPWX`, Page 1 (`0:1`). Đọc ngày 2026-10-08.

## 0. Quyết định đã duyệt (2026-10-08)

- **Thay quy tắc 1 của brief.** Mọi phòng (Sports, Robotics, Community, IAR) dùng cùng một chuỗi tương tác:
  - Hover đồ vật: hiện trạng thái hover.
  - Click đồ vật: mở pop-up.
  - Click ra ngoài hoặc nhấn Esc: đóng pop-up.
  - Áp dụng theo bảng ghép ở mục 1, kể cả những chỗ prototype chưa nối.
- **Khung giới thiệu** bị ẩn khi hover ở mọi phòng.
- **IAR:**
  - Dùng `32:475` làm frame gốc. `33:2` và `33:17` bỏ.
  - WICO `33:77` gắn với cột đo nước. Hover cột này dùng bóng trắng như các đồ vật khác (DROP_SHADOW trắng 75%, radius 40, giống hover của IAR).
- **"BG blur trắng"** trong ghi chú designer là bóng trắng quanh đồ vật khi hover. Nền không bị làm mờ khi mở pop-up.
- **Sửa lỗi trong file Figma:**
  - `1:111` (Swimming): `vàng (ele 1)` không sáng.
  - `25:285`: hiện lại đồ vật (1242,17) ở đúng thứ tự.
- **Giữ nguyên:**
  - Cây vợt đè lên thẻ kính ở `1:74`.
  - `IMG_3705` đứng tĩnh.
- **`33:32` không rỗng.** Frame có 16 layer và là hover của laptop. `get_metadata` trả frame này về dạng thẻ tự đóng nên lúc đầu mình báo nhầm là rỗng.

## 0b. Figma bị giới hạn lượt gọi (2026-10-08)

- **Figma MCP:** đã hết lượt gọi của gói Starter. Theo yêu cầu, không gọi MCP nữa.
- **REST API** (`npm run figma:sports`, token đọc từ biến môi trường `FIGMA_TOKEN`) cũng bị chặn ngay ở request đầu tiên:
  - Figma trả `429 Rate limit exceeded`, `x-figma-plan-tier=starter`, `x-figma-rate-limit-type=low`.
  - `retry-after=399027` giây, tức khoảng 4,6 ngày. Có thể chạy lại từ khoảng **2026-10-13**.
  - Loại `low` nghĩa là token thuộc ghế View/Collab. Ghế Dev/Full hoặc gói cao hơn có hạn mức lớn hơn.
- **Thông số đầy đủ của effect GLASS vẫn chưa đọc được:** fill, viền, bo góc, cường độ ánh sáng, khúc xạ, độ sâu. Mới chỉ biết radius 15 (đọc từ Plugin API ở bước 1). `scripts/fetch-figma.mjs` vẫn giữ lại, khi Figma cho gọi lại thì chạy `npm run figma:sports` để in thông số thẻ kính (dòng `[glass]`).

## 0c. Đổi cách làm: ảnh xuất tay full-frame (2026-10-08, đã duyệt)

- **Trạng thái gốc và hover:** dùng ảnh full-frame xuất từ Figma, chuyển bằng crossfade 300ms ease-out. Vùng hover/click là ô trong suốt đặt theo tọa độ layer.
- **Pop-up:** dựng bằng code: thẻ kính, tiêu đề và đoạn chữ là text thật, ảnh chụp xuất riêng.
- **Quy trình:**
  1. Xuất PNG vào `figma-export/<phòng>/`.
  2. Chạy `npm run assets:sports` (`scripts/convert-export.mjs`). Script tạo WebP q80 trong `src/assets/sports/`: frame bản 1920 và bản `-sm` 960; ảnh pop-up giữ 2x; layer đè thẻ kính dò vị trí và ghi vào `overlays.json`.
- **Ảnh đã nhận (12 file):**
  - 4 frame: `1:7`, `1:61`, `1:35`, `1:20`, xuất 2x rồi thu về 1920/960.
  - 6 ảnh pop-up, xuất 2x, đã có sẵn góc bo trong suốt.
  - 2 layer đè thẻ kính.
  - Lần đầu ba file hover bị xuất nhầm thành frame pop-up `1:74`/`1:92`/`1:111`. Đã xuất lại đúng.
- **Layer đè thẻ kính:** vị trí dò bằng cách khớp điểm ảnh với ảnh hover tương ứng.
  - `badminton-above-racket`: (0, 198, 522×882), sai khác màu 0,83/255. Figma cắt layer này theo mép frame (trái và dưới), nên khung ảnh mở rộng không đều.
  - `soccer-above-ball`: (369, 274, 553×648), sai khác 0,01/255.
- **Đổi tên đồ vật trong code:** "vàng (ele 1)" là **đôi giày** (`shoes`), IMG_3703 trông như **cái còi** (`whistle`). Tên file ảnh vẫn giữ như lúc xuất.
- **`1:111` không còn bị sáng nhầm:** pop-up Swimming nằm trên frame hover `1:20`, mà frame này chỉ có cái còi sáng.
- **Menu và khung giới thiệu là ảnh**, nằm sẵn trong ảnh full-frame. Menu chưa nối được. Khi dựng các phòng khác, mình sẽ thêm ô trong suốt theo tọa độ menu.

### Thông số pop-up: đo từ ảnh đối chiếu `figma-export/sports/ref/` (1:74, 1:92, 1:111)
| Mục | Giá trị | Cách đo |
|---|---|---|
| Viền thẻ kính | trắng đặc, dày 3px, nằm trong khung | Quét điểm ảnh mép trái |
| Bo góc | 15px | Đo cung góc trên trái |
| Nền mờ | sigma 8, phủ trắng 10%, không tăng bão hòa | Dò thông số trên vùng trống trong thẻ, sai khác trung bình 1,74/255 |
| Nội dung | ABeeZee 20px, dòng cách 24,25px | Dòng dài nhất 931,5px (Figma) / 934,5px (web). Mép chữ cách khung 4px. Số dòng 3 / 2 / 3 khớp cả ba pop-up |
| Tiêu đề | **Oswald** 400, 56px, viết hoa. Kéo lên 6px để mép chữ cách khung 3,5px như Figma | Xem dưới |
| Nội dung chữ | Đủ cả ba pop-up (Soccer, Swimming do bạn gửi 2026-10-08) | — |

**Tiêu đề: cần bạn xác nhận font.** Ghi chú của designer nói tiêu đề dùng Bahiana, nhưng ảnh xuất từ Figma không khớp Bahiana.
- Tiêu đề trong Figma cao 46px. Vùng mực của BADMINTON / SOCCER / SWIMMING rộng 243,5 / 164 / 224,5px, tức tỉ lệ rộng/cao 5,29 / 3,57 / 4,88.
- Bahiana: 3,54 / 2,64 / 3,27, hẹp hơn khoảng 1,5 lần.
- Oswald: 5,23 / 3,50 / 4,83. Ở 56px rộng 243 / 163 / 225px.
- Đã thử thêm Bahianita, Anton, Bebas Neue, League Gothic, Fjalla One và Archivo Black. Không font nào khớp bằng Oswald.
- Đang dùng Oswald để khớp ảnh Figma. Cách kiểm tra: bấm vào chữ tiêu đề trong Figma và xem tên font ở panel bên phải. Nếu là font khác thì báo mình.

### Ảnh full-frame nét hơn (2026-10-08)
- `sports-base.png` được xuất lại ở 4x (7680×4320). Ba frame hover vẫn ở 2x (3840).
- Script tạo thêm bản `-2x` (3840) cho mọi frame. `srcset` hiện có ba mức: 960w / 1920w / 3840w.
- Không tạo bản 4x: sân khấu rộng tối đa 1920 CSS px, nên màn hình mật độ 2x chỉ dùng tới 3840px.
- Mọi frame đều có bản -2x, nên ảnh gốc và ảnh hover nét như nhau khi crossfade.

### Cách dựng (Sports)
- Ảnh gốc luôn hiện. Ba ảnh hover xếp chồng lên trên và đổi độ mờ 300ms `cubic-bezier(0,0,0.58,1)`. Ảnh dùng `srcset` 960w/1920w theo kích thước sân khấu thật.
- Ô trong suốt (`<button>`) đặt theo khung layer ở frame gốc. Khi hover, ô phóng theo khung layer ở frame hover, như vùng hover của Figma.
- Pop-up: nền phía sau là ảnh hover của đồ vật đó. Mờ dần vào/ra 300ms, luôn nằm trong DOM. Click ra ngoài hoặc nhấn Esc thì đóng.
- `1:92` (Soccer): theo thứ tự layer trong Figma, đôi giày nằm **trên** thẻ kính, đè khoảng 17px mép trái. Làm giống file, giống cây vợt ở `1:74`.
- Bàn phím: Tab để làm sáng đồ vật, Enter để mở, Esc để đóng và trả focus về đồ vật.
- Điện thoại: chạm 1 lần = hover, chạm lần 2 = mở, chạm ra ngoài = về gốc.
- Pop-up thu gọn: khi chữ 20px co lại dưới 12px (sân khấu nhỏ hơn 0.6 lần), pop-up chuyển sang dạng gần toàn màn hình, chữ 16px, cuộn được.

### Làm mượt chuyển động (2026-10-08)
- **Thẻ kính không còn dùng `backdrop-filter`.** Lớp này phải tính lại vùng mờ ở mỗi khung hình nên làm giật.
  - Thay vào đó, `convert-export.mjs` tạo sẵn ảnh mờ `*-blur.webp` / `*-blur-sm.webp` cho mỗi frame hover: sigma 15, độ bão hòa 1.15, tương đương `blur(15px) saturate(1.15)`.
  - Thẻ kính cắt đúng phần ảnh đó. Kết quả giống hệt vì nền phía sau là ảnh tĩnh.
  - `backdrop-filter` chỉ còn ở pop-up thu gọn trên điện thoại (không có chuyển động) và làm dự phòng khi thiếu ảnh mờ.
- **Giải mã sẵn mọi ảnh khi vào phòng** (`img.decode()`), để lần hover đầu không bị khựng. Ảnh frame và pop-up có `will-change: opacity`.
- **Chuyển hover từ A sang B:**
  - Ảnh A được giữ bên dưới (`data-held`) trong 300ms, ảnh B hiện lên trên, nên ảnh gốc không lộ ra giữa chừng.
  - Rời đồ vật thì chờ 80ms mới bỏ hover, để rê chuột qua khe giữa hai đồ vật (vợt và giày cách nhau 4px) vẫn chuyển thẳng.
  - Đây là thêm ngoài Figma, không đổi thời gian hay easing 300ms ease-out.

## 1. Bản đồ frame (đã duyệt)

Ký hiệu: **Gốc** = trạng thái ban đầu của phòng · **Hover** = đồ vật được làm sáng · **Pop-up** = thẻ kính hiện câu chuyện.

### Sports (Flow 1, nền `IMG_3704 1`)
| Đồ vật | Layer | Hover | Pop-up |
|---|---|---|---|
| Vợt cầu lông (trái) | `vàng (ele 2) 1` | `1:61` | `1:74` Badminton |
| Đồ vật giữa | `vàng (ele 1) 1` | `1:35` | `1:92` Soccer |
| Đồ vật nhỏ (phải dưới) | `IMG_3703 1` | `1:20` | `1:111` Swimming |
Gốc: `1:7` (có khung giới thiệu `1:134`).

### Robotics (Flow 2, nền `xanh dương (bg only) 1`)
| Đồ vật | Layer | Hover | Pop-up |
|---|---|---|---|
| A | `IMG_3706 1` | `6:52` | `6:117` GArt |
| B | `IMG_3707 1` | `6:68` | `6:212` Community Events |
| C | `IMG_3708 1` | `6:84` | `6:237` Competitions |
| (không tương tác) | `IMG_3705 1` | — | — |
Gốc: `6:28`.

### Community Services (Flow 3, nền `sos1 1`)
Cả 7 đồ vật đều tên `Không Có Tiêu Đề…`, nên phân biệt bằng vị trí ở frame gốc.
| Đồ vật (x,y ở frame gốc) | Hover | Pop-up |
|---|---|---|
| (493,64) | `25:141` | `25:285` "Zero-Dong" Charity Fair |
| (912,186) | `25:186` | `26:341` "Blue Racetrack" Swimming |
| (1242,17) | `25:202` | `25:316` BeaconInRain SOS Alert |
| (533,357) | `25:218` | `26:357` Humanitas |
| (1081,303) | `25:234` | `26:378` Volunteer Work in Ba Vì |
| (577,639) | `25:250` | `26:399` Cerebral Palsy Family |
| (1114,654) | `25:269` | `26:420` Advisor-Advisee 2025 |
Gốc: `25:170`.

### Innovation & Research (nền `IMG_0955 1`)
| Đồ vật | Layer | Hover | Pop-up |
|---|---|---|---|
| Tường poster | `IMG_0961 1` | `33:62` | `33:137` Tekmonk |
| Laptop | `IMG_0963 1` | `33:32` | `33:97` Other research |
| Robot | `IMG_0964 1` / `09c877…` (531,720) | `33:47` | `33:117` VSIC |
| Cột thiết bị đo nước | `IMG_0962 1` / `09c877…` (394,218) | **không có** | `33:77` WICO (đoán) |
Gốc: `32:475` hoặc `33:17` (hai frame giống hệt nhau). `33:2` là bản cũ.

### Trang chủ (nền `Không Có Tiêu Đề9…`)
Gốc `25:44` · About Me `25:76` · How to Play `25:103` · Select the Memory `25:126`. Đây là các pop-up kính trên màn máy game, chưa có liên kết nào.

## 2. Chỗ phải đoán / không nhất quán

1. **Không có frame "nền mờ" riêng.** Hiệu ứng mờ khi hover hay pop-up chỉ là layer kính `Rectangle 1/2` với effect `GLASS` radius 15. Phần nền phía sau pop-up không có lớp blur nào.
2. **Glow khi hover** là DROP_SHADOW trắng, kèm phóng to nhẹ đồ vật. Thông số khác nhau tuỳ đồ vật:
   - Sports: IMG_3703 r50 / 75%, ele 1 r60 / 75%, ele 2 r80 / 70%.
   - Robotics: r75 / 75%.
   - Community và IAR: r40 / 75%, riêng Community (493,64) là r60.
3. **Khung giới thiệu khi hover:**
   - Biến mất ở các hover của Sports, ở Robotics `6:52` và ở các hover của Community.
   - Vẫn còn ở Robotics `6:68`, `6:84` và mọi hover của IAR.
   - Sẽ làm đúng theo từng frame.
4. Sports `1:111` (Swimming): `vàng (ele 1)` cũng đang sáng, dù pop-up là của IMG_3703.
5. Sports `1:74`: `vàng (ele 2)` nằm **trên** thẻ kính (thứ tự layer). Các pop-up khác thì đồ vật nằm dưới thẻ.
6. Community `25:285`: layer (1242,17) bị đưa xuống dưới ảnh nền nên bị che mất. Nhiều khả năng là lỗi thao tác.
7. IAR:
   - `33:2` dùng ảnh robot và cột cũ. `32:475` = `33:17` dùng ảnh mới, có mặt robot và cột có bút. **Đề xuất dùng `32:475` làm frame gốc.**
   - Trong `32:475`, chữ "Sports" trên menu bị mờ đi. Cần kiểm tra thêm.
   - Các hover `33:32` / `33:47` dùng ảnh nền khác (`09c877…` full-frame), không phải `IMG_0955`. `33:62` có thêm một ảnh lệch x = -599.
   - Pop-up WICO `33:77` không có đồ vật nào sáng. Mình đoán WICO thuộc cột thiết bị đo nước (nội dung nói về "water testing device"), cột này không có frame hover.
8. Robotics `IMG_3705 1` (cột giữa) không có hover hay pop-up nào.
9. Text rời `Sports` (25:138) và `Community Services` (25:139) nằm ngoài frame. 25:138 có liên kết click → `1:7`.
10. Hover trong file là `ON_HOVER` = "While hovering". 27/28 liên kết dùng Smart Animate 300ms ease-out. Riêng `25:181 → 25:141` là Instant.

## 3. Prototype chưa nối (dựng tĩnh, chờ quyết định)
- Mọi click mở pop-up ở Robotics, Community, IAR. Mọi hover ở Community (trừ một) và IAR.
- Trang chủ: About Me / How to Play / Select the Memory, cùng 4 lựa chọn phòng.
- Menu trên cùng, trừ Sports → Robotics và Robotics → Sports.
- Sports: không có đường từ pop-up quay về gốc.

## 4. Các phòng còn lại (2026-10-08)

- Đã dựng sẵn cấu hình **Robotics, Community, IAR** (`src/rooms/*.ts`) theo bảng ở mục 1. Tọa độ ô hover, khung pop-up và ảnh lấy từ dữ liệu layer đọc ở bước 1. Chưa có ảnh nên đang hiện khung giữ chỗ.
- Danh sách ảnh cần xuất: [EXPORT.md](EXPORT.md). Chạy `npm run assets -- <phòng>` sau khi xuất.
- `convert-export.mjs` tự kiểm tra từng ảnh hover so với ảnh gốc:
  - Ngoài vùng đồ vật, nền phải khớp.
  - Ảnh hover không được còn khung giới thiệu.
  - Sports đã qua cả hai bước kiểm tra.
- **Robotics `6:68`, `6:84` và cả 3 hover của IAR** trong Figma vẫn còn khung giới thiệu. Theo quyết định "ẩn khung giới thiệu khi hover ở mọi phòng", cần ẩn layer đó trước khi xuất (đã ghi trong EXPORT.md).
- **Cột đo nước (IAR)** không có frame hover. Script ghép ảnh hover từ ảnh gốc và layer cột 37:328: phóng 1,112 lần quanh tâm như laptop, thêm bóng trắng radius 40 / 75% như các hover IAR khác. Đây là chỗ thêm ngoài Figma.
- **Liên kết menu theo prototype:** Sports "Robotics" → Robotics, Robotics "Sports" → Sports. Đổi phòng bằng hiệu ứng mờ dần 300ms ease-out. Các mục menu khác chưa nối, chờ quyết định.
- **Ảnh pop-up vượt mép dưới frame** (image 20, 21, 22, 24, 25, 27): khung ảnh được cắt theo mép frame, dùng `object-fit: cover` neo trên. Ảnh xuất ra bị Figma cắt hay để nguyên đều không méo.
- **Robotics Competitions:** hai đoạn chữ cao 328px chồng lên vùng ảnh. Có thể Figma dùng dòng trống để chừa chỗ cho ảnh, cần ảnh đối chiếu `6:237` để xác định.
- **Text rời ngoài frame** (35:244 "Vietnam Signature…", 35:249 "VEX V5 … National Championship…") có thể là nội dung dành cho pop-up Competitions. Chưa dùng.
- **Chờ nội dung chữ đầy đủ:** Robotics (6 đoạn), Community (7 đoạn + 4 tiêu đề đang bị cắt, tiêu đề Cerebral Palsy 2 dòng), IAR (4 đoạn). Đang đánh dấu `[chờ nội dung]`.
- **Trang chủ chưa dựng**, chờ quyết định có nối menu hay không. Hiện mặc định vào Sports (Flow 1).

## 5. Trang chủ và menu (2026-10-08, đã duyệt)

- **Trang chủ** (`src/home/`) là trang mở mặc định:
  - Menu About Me / Select the Memory / How to Play là ô trong suốt đặt lên ảnh `25:44`.
  - Bấm vào thì hiện thẻ kính của `25:76` / `25:126` / `25:103`. Thẻ dựng bằng code, chữ thật, mờ dần 300ms.
  - Esc hoặc click ra ngoài thì đóng. Bấm mục menu khác thì chuyển thẻ.
- **Select the Memory:** 4 tên phòng là liên kết thật, dẫn vào phòng tương ứng.
- **Đường dẫn:** `#/` (trang chủ), `#/about`, `#/howto`, `#/select` (trang chủ mở sẵn thẻ), `#/sports`, `#/robotics`, `#/community`, `#/iar`.
- **Menu trong phòng** (`src/room/nav.ts`):
  - Logo về trang chủ. About Me và How to Play về trang chủ và mở sẵn thẻ tương ứng.
  - Tên phòng dẫn sang phòng đó. Mục của phòng hiện tại không có liên kết.
  - Đổi màn hình mờ dần 300ms.
- **Không làm chuyển động** cho D-pad / phím mũi tên (brief, quy tắc 5).
- **Đang đoán, chờ ảnh đối chiếu `25:76` / `25:103` / `25:126`:**
  - Cỡ chữ tiêu đề "How to Play" (96px trong khung 107px).
  - 4 tên phòng: Oswald 72px, bóng cứng #cc6b24 lệch 4px.
  - Bóng của thẻ: 0 4px 4px đen 25%.
- **Lệch nhỏ trong Figma:** ở `25:126`, khung máy game (Rectangle 2) nằm ở y = 118 thay vì 115 và tiêu đề lệch 2px. Mình dùng chung ảnh `25:44` cho mọi thẻ nên bỏ qua.

## 6. Font tiêu đề: Bahiana (bạn xác nhận 2026-10-08)

- Tiêu đề pop-up và 4 tên phòng ở trang chủ dùng Bahiana, 61px (chữ cao 46px như ảnh Figma), kéo lên 2px.
- **Lưu ý:** Bahiana bản Google Fonts trên web hẹp hơn chữ trong ảnh xuất từ Figma khoảng 1,5 lần (BADMINTON: 163px so với 243,5px). Nếu nhìn trên web thấy tiêu đề mảnh hơn Figma, nên kiểm tra trong Figma:
  - Có cảnh báo "Missing fonts" không.
  - Layer tiêu đề có letter spacing hoặc font khác không.

## 7. Lấp viền và màn hình chưa có ảnh (2026-10-08)

- **Lỗi đã sửa:** lần đẩy trước đặt trang chủ làm trang mở mặc định khi chưa có ảnh trang chủ, nên bản trên Vercel chỉ hiện khung giữ chỗ.
- **Cách sửa:** màn hình chỉ hiện cho người xem khi đã có ảnh gốc (`isReady` trong `App.tsx`). Chưa có thì chuyển về Sports và đổi thanh địa chỉ thành `#/sports`. Xuất ảnh xong thì màn hình đó tự bật, không cần sửa code.
- **Lấp viền (cách A, đã duyệt):** khi khung trình duyệt không đúng 16:9, phần thừa được lấp bằng ảnh gốc của màn hình hiện tại:
  - Bản `-sm`, phóng kín khung, `blur(40px) brightness(0.55) saturate(1.1)`.
  - Ảnh tĩnh, mờ dần 300ms khi đổi màn hình.

## 8. Nháy khi mở trang (2026-10-08)

- **Hiện tượng:** mở trang Vercel thì khung vợt và giày nháy lên vài lần rất nhanh.
- **Nguyên nhân:** các lớp của phòng Sports xuất hiện ở các thời điểm khác nhau. Nền SVG (inline) hiện ngay, sprite vợt/giày tải xong sau, ảnh toàn cảnh tải xong sau nữa.
- **Cách sửa:**
  - `useImagesReady` chờ mọi `<img>` (và `<image>` trong SVG) tải và giải mã xong, giới hạn chờ tối đa 4 giây. Sau đó phòng/trang chủ mới hiện bằng một lần mờ dần 300ms (`.room[data-ready]`).
  - Nền mờ hai bên chỉ hiện khi ảnh đã tải (`onLoad`).
  - Hiệu ứng hover không đổi.
