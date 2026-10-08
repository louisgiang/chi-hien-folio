# NOTES: Chí Hiển's Folio

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
