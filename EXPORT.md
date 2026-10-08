# Danh sách ảnh cần xuất từ Figma

Lưu vào `figma-export/<phòng>/` với đúng tên file bên dưới, rồi chạy `npm run assets -- <phòng>`.
Script tự kiểm tra ảnh hover (nền khớp ảnh gốc, không còn khung giới thiệu) và báo nếu sai.

**Cách tìm frame/layer theo ID:** mở link `https://www.figma.com/design/93v05w3au1CsDYzL4cAPWX/Chi-Hien-s-Folio?node-id=<ID>`, thay `:` bằng `-` (ví dụ `6:52` → `node-id=6-52`). Figma sẽ chọn sẵn frame/layer đó.

**Thiết lập xuất:**
- Frame (gốc / hover): PNG **2x**, chọn cả frame.
- Ảnh trong pop-up: PNG **2x**, chọn đúng layer ảnh.
- Kiểm tra panel bên phải: frame phải là W 1920 × H 1080.

---

## Sports ✅ đã xong

---

## Robotics → `figma-export/robotics/`

### Frame
| Frame | Trạng thái | Tên file | Lưu ý |
|---|---|---|---|
| `6:28` | Gốc | `robotics-base.png` | |
| `6:52` | Hover IMG_3706 → GArt | `robotics-hover-gart.png` | |
| `6:68` | Hover IMG_3707 → Community Events | `robotics-hover-events.png` | ⚠ **Ẩn** `Rectangle 1` (6:81) và đoạn chữ "Growing up…" (6:82) trước khi xuất |
| `6:84` | Hover IMG_3708 → Competitions | `robotics-hover-competitions.png` | ⚠ **Ẩn** `Rectangle 1` (6:97) và "Growing up…" (6:98) trước khi xuất |

Ẩn layer: bấm biểu tượng con mắt trong panel Layers, hoặc chọn layer rồi nhấn Ctrl+Shift+H. Xuất xong nhớ hiện lại.

### Ảnh trong pop-up
| Pop-up | Layer (ID) | Tên file |
|---|---|---|
| GArt `6:117` | `image 17` (25:38), ảnh ngang bên phải | `gart-1.png` |
| | `image 24` (33:234), ảnh dọc bên dưới | `gart-2.png` |
| Community Events `6:212` | `image 13` (25:24) | `events-1.png` |
| | `image 16` (25:36) | `events-2.png` |
| | `image 14` (25:32) | `events-3.png` |
| | `image 25` (35:240), ảnh dọc bên dưới | `events-4.png` |
| Competitions `6:237` | `image 26` (35:247) | `competitions-1.png` |
| | `image 7` (25:3) | `competitions-2.png` |
| | `image 8` (25:5) | `competitions-3.png` |
| | `Ellipse 1` (25:6), chấm tròn 14px | `competitions-dot-1.png` |
| | `Ellipse 2` (25:7) | `competitions-dot-2.png` |

---

## Community Services → `figma-export/community/`

### Frame (các frame hover không có khung giới thiệu, không cần ẩn gì)
| Frame | Trạng thái | Tên file |
|---|---|---|
| `25:170` | Gốc | `community-base.png` |
| `25:141` | Hover đồ vật (493,64) → Zero-Dong | `community-hover-zerodong.png` |
| `25:186` | Hover (912,186) → Blue Racetrack | `community-hover-racetrack.png` |
| `25:202` | Hover (1242,17) → BeaconInRain | `community-hover-beacon.png` |
| `25:218` | Hover (533,357) → Humanitas | `community-hover-humanitas.png` |
| `25:234` | Hover (1081,303) → Ba Vì | `community-hover-bavi.png` |
| `25:250` | Hover (577,639) → Cerebral Palsy | `community-hover-cerebral.png` |
| `25:269` | Hover (1114,654) → Advisor-Advisee | `community-hover-advisor.png` |

### Ảnh trong pop-up
| Pop-up | Layer (ID) | Tên file |
|---|---|---|
| Zero-Dong `25:285` | `image 1` (26:444) | `zerodong-1.png` |
| | `image 20` (26:451) | `zerodong-2.png` |
| Blue Racetrack `26:341` | `image 1` (26:453) | `racetrack-1.png` |
| | `image 2` (26:455) | `racetrack-2.png` |
| BeaconInRain `25:316` | `image 1` (26:376) | `beacon-1.png` |
| | `image 2` (26:377) | `beacon-2.png` |
| Humanitas `26:357` | `image 1` (25:335) | `humanitas-1.png` |
| | `image 2` (25:337) | `humanitas-2.png` |
| Ba Vì `26:378` | `image 1` (26:397) | `bavi-1.png` |
| | `image 2` (26:398) | `bavi-2.png` |
| Cerebral Palsy `26:399` | `image 1` (26:418) | `cerebral-1.png` |
| | `image 2` (26:419) | `cerebral-2.png` |
| Advisor-Advisee `26:420` | `image 27` (35:252) | `advisor-1.png` |

Nhiều pop-up đều có layer tên `image 1` / `image 2`: tìm theo ID cho khỏi nhầm.

---

## Innovation & Research → `figma-export/iar/`

### Frame
| Frame | Trạng thái | Tên file | Lưu ý |
|---|---|---|---|
| `32:475` | Gốc | `iar-base.png` | Không dùng `33:2` / `33:17` |
| `33:62` | Hover tường poster → Tekmonk | `iar-hover-posters.png` | ⚠ **Ẩn** `Rectangle 1` (33:72) + chữ "Innovation and Research: B…" (33:73) |
| `33:32` | Hover laptop → Other research | `iar-hover-laptop.png` | ⚠ **Ẩn** `Rectangle 1` (33:42) + chữ (33:43) |
| `33:47` | Hover robot → VSIC | `iar-hover-robot.png` | ⚠ **Ẩn** `Rectangle 1` (33:57) + chữ (33:58) |

### Layer cột đo nước (để mình ghép ảnh hover, vì Figma không có frame này)
| Layer (ID) | Trong frame | Tên file |
|---|---|---|
| `09c877a6…` (37:328), cột cao ở (394,218) 110×670 | `32:475` | `iar-column.png` (PNG 2x, nền trong suốt) |

### Ảnh trong pop-up
| Pop-up | Layer (ID) | Tên file |
|---|---|---|
| Tekmonk `33:137` | `image 1` (33:155) | `tekmonk-1.png` |
| | `image 2` (33:231) | `tekmonk-2.png` |
| WICO `33:77` | `image 1` (33:95) | `wico-1.png` |
| | `image 21` (33:221) | `wico-2.png` |
| Other research `33:97` | `image 1` (33:226), ảnh ngang bên phải | `other-1.png` |
| | `image 22` (33:224), ảnh dọc bên dưới | `other-2.png` |
| VSIC `33:117` | `image 1` (33:135) | `vsic-1.png` |
| | `image 23` (33:228) | `vsic-2.png` |

---

## Ảnh đối chiếu pop-up (nên có): `figma-export/<phòng>/ref/`

Không đưa vào web, chỉ để mình so bố cục và chữ như đã làm với Sports. Xuất cả frame PNG 2x, đặt tên theo ID (`6-117.png`, …):
- Robotics: `6:117`, `6:212`, `6:237`. **Rất cần**, vì các pop-up này có nhiều đoạn chữ xen giữa ảnh.
- Community: `25:285`, `26:341`, `25:316`, `26:357`, `26:378`, `26:399`, `26:420`
- IAR: `33:137`, `33:77`, `33:97`, `33:117`
