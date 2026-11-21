import { beginnerQuestion } from './beginnerQuestion'

export const soundGroups = [
  { id: 'vowels', name: 'Nguyên âm đơn', description: 'Giữ lưỡi và môi gần như nguyên vị trí khi đọc một âm.' },
  { id: 'glides', name: 'Nguyên âm đôi', description: 'Bắt đầu ở một khẩu hình, rồi lướt sang khẩu hình thứ hai trong cùng một âm.' },
  { id: 'consonants', name: 'Phụ âm', description: 'Dùng môi, răng hoặc lưỡi để chặn hay thu hẹp đường hơi.' },
] as const

type Group = typeof soundGroups[number]['id']
type Example = readonly [word: string, transcription: string, meaning: string, sentence: string, translation: string]
type Entry = readonly [
  id: string, symbol: string, cue: string, mouth: string, tip: string, mistake: string, example: Example,
]

const entries: Record<Group, Entry[]> = {
  vowels: [
    ['long-i', 'iː', 'Âm trước, cao và rõ.', 'Môi hơi kéo ngang, lưỡi cao và tiến ra trước.', 'Giữ âm đều. Trong see, không lướt sang âm khác.', 'Đọc ngắn và thả lỏng quá khiến see gần với âm /ɪ/.', ['see', 'siː', 'nhìn thấy', 'I see a cat.', 'Tôi nhìn thấy một con mèo.']],
    ['short-i', 'ɪ', 'Âm ngắn, lỏng hơn /iː/.', 'Hạ lưỡi một chút và thả lỏng môi.', 'Nghe ship và sheep liền nhau để nhận cả độ dài lẫn vị trí lưỡi.', 'Đọc ship như sheep khi dùng âm i quá căng.', ['ship', 'ʃɪp', 'tàu', 'I see a ship.', 'Tôi nhìn thấy một con tàu.']],
    ['e', 'e', 'Âm trước, mở vừa.', 'Lưỡi ở phía trước; hàm mở vừa phải.', 'Lấy bet làm mốc rồi thử mở hàm thêm để ra /æ/.', 'Mở rộng quá làm bet nghe gần như bat.', ['bet', 'bet', 'vụ cá cược', 'It is a small bet.', 'Đó là một vụ cá cược nhỏ.']],
    ['ash', 'æ', 'Âm trước, hàm mở rộng.', 'Hạ hàm, giữ lưỡi thấp và ở phía trước.', 'Nhìn gương để thấy miệng mở hơn khi đọc /e/.', 'Kéo lưỡi về sau như khi nói a tiếng Việt.', ['bat', 'bæt', 'con dơi', 'A bat can fly.', 'Con dơi có thể bay.']],
    ['uh', 'ʌ', 'Âm ngắn ở giữa miệng.', 'Môi thả lỏng, hàm mở nhẹ, lưỡi ở giữa.', 'Đọc cup gọn trong một nhịp.', 'Kéo dài như /ɑː/ hoặc tròn môi như /ɒ/.', ['cup', 'kʌp', 'cái cốc', 'I have a cup.', 'Tôi có một cái cốc.']],
    ['ah', 'ɑː', 'Âm mở, lưỡi thấp về sau.', 'Hạ hàm, lưỡi lùi, không tròn môi.', 'Giữ khẩu hình rộng khi nói calm.', 'Đọc quá ngắn hoặc thêm âm r ở cuối phiên âm Anh–Anh của car.', ['calm', 'kɑːm', 'bình tĩnh', 'Stay calm.', 'Hãy bình tĩnh.']],
    ['lot', 'ɒ', 'Âm ngắn, hàm mở và môi hơi tròn.', 'Lưỡi thấp về sau, môi hơi tròn.', 'Nghe cot theo giọng Anh–Anh.', 'Đọc giống cách phát âm /ɑ/ của một số giọng Anh–Mỹ khi đang luyện mẫu Anh–Anh.', ['cot', 'kɒt', 'giường nhỏ', 'This is a cot.', 'Đây là một chiếc giường nhỏ.']],
    ['aw', 'ɔː', 'Âm tròn môi và giữ tương đối đều.', 'Lưỡi lùi, môi tròn hơn khi đọc /ɒ/.', 'Giữ hơi qua nguyên âm của saw.', 'Kết thúc bằng âm u lướt khiến saw nghe như nguyên âm đôi.', ['saw', 'sɔː', 'đã nhìn thấy', 'I saw a bird.', 'Tôi đã nhìn thấy một con chim.']],
    ['short-u', 'ʊ', 'Âm tròn môi nhẹ, đọc ngắn.', 'Nâng phần sau lưỡi vừa phải và thả lỏng môi.', 'Đọc book với một nguyên âm gọn.', 'Chúm môi quá chặt và kéo dài như /uː/.', ['book', 'bʊk', 'quyển sách', 'I read a book.', 'Tôi đọc một quyển sách.']],
    ['oo', 'uː', 'Âm cao, môi tròn.', 'Nâng lưỡi, làm tròn môi và giữ nguyên hướng hơi.', 'Giữ âm rõ ở giữa từ food.', 'Đọc food ngắn như /ʊ/ trong foot.', ['food', 'fuːd', 'đồ ăn', 'The food is hot.', 'Đồ ăn nóng.']],
    ['er', 'ɜː', 'Âm dài vùng giữa miệng.', 'Lưỡi ở giữa, môi thả lỏng và hàm mở vừa.', 'Giữ âm trong bird; mẫu Anh–Anh ở đây không có /r/ sau nguyên âm.', 'Cuộn lưỡi thêm r khi đang luyện phiên âm Anh–Anh này.', ['bird', 'bɜːd', 'con chim', 'I see a bird.', 'Tôi nhìn thấy một con chim.']],
    ['schwa', 'ə', 'Âm nhẹ trong phần không nhấn.', 'Thả lỏng hàm và lưỡi ở giữa miệng.', 'Đọc âm đầu của away thật nhẹ rồi nhấn phần way.', 'Đọc chữ a đầu thành âm a đầy đủ và nhấn quá mạnh.', ['away', 'əˈweɪ', 'ra xa', 'Go away.', 'Hãy đi ra xa.']],
  ],
  glides: [
    ['ay', 'eɪ', 'Lướt từ /e/ về phía /ɪ/.', 'Mở vừa lúc đầu rồi nâng lưỡi lên.', 'Giữ một nhịp cho cả âm trong day.', 'Dừng ở /e/ và làm mất phần lướt.', ['day', 'deɪ', 'ngày', 'Have a nice day.', 'Chúc bạn một ngày tốt lành.']],
    ['eye', 'aɪ', 'Mở rộng rồi lướt lên trước.', 'Hạ hàm lúc đầu, thu miệng dần khi lưỡi lên cao.', 'Đọc my liền hơi trong một nhịp.', 'Tách thành hai tiếng a và i riêng.', ['my', 'maɪ', 'của tôi', 'This is my bag.', 'Đây là túi của tôi.']],
    ['oy', 'ɔɪ', 'Bắt đầu tròn môi rồi mở về phía /ɪ/.', 'Môi tròn ở đầu, sau đó nới môi và đưa lưỡi lên trước.', 'Nghe sự đổi khẩu hình trong toy.', 'Chỉ đọc âm ô khiến từ mất đoạn lướt.', ['toy', 'tɔɪ', 'đồ chơi', 'It is a toy.', 'Nó là một món đồ chơi.']],
    ['oh', 'əʊ', 'Âm lướt từ giữa miệng đến môi tròn.', 'Bắt đầu thả lỏng, kết thúc bằng môi tròn nhẹ.', 'Dùng mẫu Anh–Anh go để nghe đoạn lướt.', 'Đọc go bằng một âm ô đứng yên.', ['go', 'ɡəʊ', 'đi', 'I go home.', 'Tôi về nhà.']],
    ['ow', 'aʊ', 'Mở rộng rồi thu về môi tròn.', 'Hạ hàm, sau đó khép dần và tròn môi.', 'Nói now trong một nhịp liền.', 'Chốt âm thành /o/ quá sớm.', ['now', 'naʊ', 'bây giờ', 'Come now.', 'Đến ngay bây giờ.']],
    ['ear', 'ɪə', 'Từ âm /ɪ/ lướt về vị trí lưỡi thả lỏng.', 'Bắt đầu lưỡi cao, hạ nhẹ về giữa miệng.', 'Dùng mẫu Anh–Anh here và giữ liền hơi.', 'Đọc thành /iː/ kéo dài rồi gắn thêm r.', ['here', 'hɪə', 'ở đây', 'I am here.', 'Tôi ở đây.']],
    ['air', 'eə', 'Từ âm /e/ lướt nhẹ về giữa miệng.', 'Lưỡi bắt đầu phía trước rồi thả lỏng về giữa.', 'Nói hair liền một nhịp theo mẫu.', 'Nhấn phần /ə/ thành một tiếng riêng.', ['hair', 'heə', 'tóc', 'Her hair is long.', 'Tóc cô ấy dài.']],
    ['oor', 'ʊə', 'Từ /ʊ/ lướt về âm nhẹ /ə/.', 'Môi tròn nhẹ lúc đầu rồi thả lỏng dần.', 'Đây là cách đọc truyền thống, một số giọng đọc từ tour với nguyên âm khác.', 'Cố phát âm chữ r cuối khi đang theo mẫu không đọc r.', ['tour', 'tʊə', 'chuyến tham quan', 'We take a tour.', 'Chúng tôi đi tham quan.']],
  ],
  consonants: [
    ['p', 'p', 'Bật hơi từ hai môi, cổ họng không rung.', 'Khép hai môi rồi mở nhanh.', 'Đầu từ pen thường có một luồng hơi nhẹ.', 'Bỏ âm cuối /p/ trong những từ như cup.', ['pen', 'pen', 'cây bút', 'This is a pen.', 'Đây là một cây bút.']],
    ['b', 'b', 'Khép rồi mở môi, có tiếng rung.', 'Hai môi chạm nhau, sau đó mở nhanh.', 'Chạm cổ họng và so sánh /b/ với /p/.', 'Thêm một tiếng ơ sau /b/ cuối từ.', ['bag', 'bæɡ', 'cái túi', 'My bag is blue.', 'Túi của tôi màu xanh dương.']],
    ['t', 't', 'Chặn hơi ở gờ ngay sau răng trên.', 'Chạm đầu lưỡi vào gờ lợi, rồi thả ra.', 'Nghe hơi thoát ngắn ở đầu tin.', 'Đặt lưỡi giữa hai hàm răng khiến âm gần /θ/.', ['tin', 'tɪn', 'hộp thiếc', 'I open the tin.', 'Tôi mở hộp thiếc.']],
    ['d', 'd', 'Chặn rồi nhả hơi như /t/, có rung.', 'Đặt đầu lưỡi lên gờ sau răng trên.', 'Chú ý vị trí lưỡi khác /ð/.', 'Đưa lưỡi ra giữa hai hàm răng như /ð/.', ['den', 'den', 'hang thú', 'A fox has a den.', 'Cáo có một cái hang.']],
    ['k', 'k', 'Chặn đường hơi bằng phần sau lưỡi.', 'Nâng cuống lưỡi chạm vòm mềm rồi thả.', 'Từ cat bắt đầu bằng tiếng bật và hơi thoát.', 'Bỏ âm /k/ ở cuối từ như book.', ['cat', 'kæt', 'con mèo', 'A cat is here.', 'Một con mèo ở đây.']],
    ['g', 'ɡ', 'Vị trí như /k/, có rung thanh quản.', 'Nâng phần sau lưỡi lên vòm mềm rồi thả.', 'Chạm cổ họng khi thử âm đầu từ go.', 'Làm mất âm cuối /ɡ/ trong bag.', ['game', 'ɡeɪm', 'trò chơi', 'We play a game.', 'Chúng tôi chơi một trò chơi.']],
    ['f', 'f', 'Hơi qua răng trên và môi dưới.', 'Đặt răng trên chạm nhẹ môi dưới.', 'Giữ hơi ra đều, cổ họng không rung.', 'Khép hai môi thành một âm bật.', ['fish', 'fɪʃ', 'con cá', 'I see a fish.', 'Tôi nhìn thấy một con cá.']],
    ['v', 'v', 'Vị trí như /f/, có rung.', 'Răng trên chạm nhẹ môi dưới.', 'Thử giữ v rồi đặt tay lên cổ.', 'Đọc van gần như fan khi mất tiếng rung.', ['van', 'væn', 'xe tải nhỏ', 'The van is here.', 'Xe tải nhỏ ở đây.']],
    ['th-air', 'θ', 'Hơi lướt qua đầu lưỡi, không rung.', 'Đưa đầu lưỡi chạm nhẹ mép răng, để hơi tiếp tục thoát.', 'Kéo thử θ trong nửa giây rồi nối với in.', 'Bật lưỡi ra thành /t/ khiến thin gần tin.', ['thin', 'θɪn', 'mỏng', 'The book is thin.', 'Quyển sách mỏng.']],
    ['th-voice', 'ð', 'Hơi lướt qua đầu lưỡi, có rung.', 'Để đầu lưỡi chạm nhẹ mép răng và giữ khe hơi.', 'Đặt tay lên cổ để phân biệt với /θ/.', 'Chặn hết hơi như /d/ khiến then gần den.', ['then', 'ðen', 'sau đó', 'Then we go home.', 'Sau đó chúng tôi về nhà.']],
    ['s', 's', 'Hơi rít qua khe hẹp phía trước.', 'Đầu lưỡi gần gờ lợi, môi giữ tự nhiên.', 'Tạo tiếng xì sáng trong sip.', 'Chúm môi và lùi lưỡi khiến /s/ thành /ʃ/.', ['sip', 'sɪp', 'nhấp một ngụm', 'Sip the tea.', 'Hãy nhấp một ngụm trà.']],
    ['z', 'z', 'Tiếng rít như /s/, thêm rung cổ họng.', 'Giữ khe hẹp gần gờ lợi.', 'Đặt tay lên cổ để cảm nhận rung khi đọc zoo.', 'Đọc /z/ giống /s/ vì mất tiếng rung.', ['zoo', 'zuː', 'sở thú', 'We go to the zoo.', 'Chúng tôi đến sở thú.']],
    ['sh', 'ʃ', 'Tiếng xì với lưỡi lùi hơn /s/.', 'Lùi lưỡi khỏi gờ lợi một chút, môi có thể hơi tròn.', 'Giữ được tiếng xì trước khi nối sang nguyên âm.', 'Dùng /s/ đầu từ khiến ship nghe như sip.', ['shoe', 'ʃuː', 'chiếc giày', 'I see a shoe.', 'Tôi nhìn thấy một chiếc giày.']],
    ['zh', 'ʒ', 'Tiếng xì như /ʃ/, có rung.', 'Giữ lưỡi hơi lùi và môi thả lỏng.', 'Nghe ở giữa vision, cổ họng vẫn rung.', 'Đọc thành /z/ hoặc /ʃ/ làm đổi vị trí hoặc độ rung.', ['vision', 'ˈvɪʒən', 'thị lực', 'My vision is good.', 'Thị lực của tôi tốt.']],
    ['h', 'h', 'Một luồng hơi nhẹ từ cổ họng.', 'Mở đường hơi và chuẩn bị miệng cho nguyên âm kế tiếp.', 'Đặt tay trước miệng để cảm thấy hơi đầu từ hat.', 'Tạo âm gằn mạnh ở cổ hoặc bỏ h đầu từ.', ['hat', 'hæt', 'cái mũ', 'I have a hat.', 'Tôi có một cái mũ.']],
    ['ch', 'tʃ', 'Chặn ngắn rồi thả thành tiếng xì.', 'Đầu và mặt lưỡi chạm gần gờ lợi rồi hạ nhẹ.', 'So sánh chip với ship và chú ý tiếng bật đầu.', 'Bỏ phần chặn làm chip nghe như ship.', ['chip', 'tʃɪp', 'miếng khoai chiên', 'I eat a chip.', 'Tôi ăn một miếng khoai chiên.']],
    ['j', 'dʒ', 'Chặn rồi xì như /tʃ/, có rung.', 'Đặt lưỡi gần gờ lợi rồi nhả, giữ tiếng rung.', 'Nghe đầu từ jam và cảm nhận cổ họng.', 'Đọc âm đầu giống /j/ trong yes.', ['jam', 'dʒæm', 'mứt', 'I like jam.', 'Tôi thích mứt.']],
    ['m', 'm', 'Âm mũi, khép môi.', 'Khép hai môi và để hơi đi qua mũi.', 'Kéo m nhẹ trước khi mở miệng nói milk.', 'Thêm tiếng ơ sau /m/ cuối từ.', ['milk', 'mɪlk', 'sữa', 'I drink milk.', 'Tôi uống sữa.']],
    ['n', 'n', 'Âm mũi, đầu lưỡi ở phía trước.', 'Đầu lưỡi chạm gờ lợi và hơi qua mũi.', 'So sánh đầu lưỡi với vị trí lưỡi sau trong /ŋ/.', 'Đổi /n/ cuối thành /ŋ/ theo thói quen của một số giọng Việt.', ['nose', 'nəʊz', 'mũi', 'This is my nose.', 'Đây là mũi của tôi.']],
    ['ng', 'ŋ', 'Âm mũi, lưỡi nâng ở phía sau.', 'Dùng cuống lưỡi chạm vòm mềm, để hơi đi qua mũi.', 'Giữ cuối từ sing trong một nhịp ngắn.', 'Thêm /ɡ/ bật ở cuối sing.', ['sing', 'sɪŋ', 'hát', 'I can sing.', 'Tôi có thể hát.']],
    ['l', 'l', 'Hơi thoát qua hai bên lưỡi.', 'Chạm đầu lưỡi vào gờ lợi, để cạnh lưỡi hở.', 'Thử l đầu từ leaf với đầu lưỡi đứng yên.', 'Đổi /l/ cuối từ thành một nguyên âm.', ['leaf', 'liːf', 'chiếc lá', 'The leaf is green.', 'Chiếc lá màu xanh lá.']],
    ['r', 'r', 'Âm đầu từ rõ, lưỡi không chạm lợi.', 'Đưa đầu lưỡi lên gần vòm trước, giữ một khoảng hở.', 'Trong mẫu này /r/ ghi cách đọc tiếng Anh thường là [ɹ].', 'Rung hoặc gõ mạnh đầu lưỡi khi nói red.', ['red', 'red', 'đỏ', 'It is red.', 'Nó màu đỏ.']],
    ['y', 'j', 'Lướt nhanh từ vị trí âm i sang nguyên âm sau.', 'Nâng mặt lưỡi gần vòm cứng rồi hạ nhanh.', 'Yes bắt đầu bằng /j/, khác /dʒ/ trong jam.', 'Nhìn ký hiệu j và đọc thành âm đầu của jam.', ['yes', 'jes', 'vâng, có', 'Yes, I can.', 'Vâng, tôi có thể.']],
    ['w', 'w', 'Lướt nhanh từ môi tròn sang nguyên âm sau.', 'Chúm môi, nâng phần sau lưỡi rồi mở nhanh.', 'Nhìn môi tròn nhẹ ở đầu từ wet.', 'Đặt răng lên môi dưới như âm /v/.', ['wet', 'wet', 'ướt', 'My bag is wet.', 'Túi của tôi bị ướt.']],
  ],
}

const extras: Record<string, Example[]> = {
  'long-i': [
    ['meet', 'miːt', 'gặp', 'We meet at nine.', 'Chúng ta gặp lúc chín giờ.'],
    ['green', 'ɡriːn', 'màu xanh lá', 'The bag is green.', 'Cái túi màu xanh lá.'],
  ],
}

export const ipaSounds = soundGroups.flatMap(({ id: group }) =>
  entries[group].map(([id, symbol, cue, mouth, tip, mistake, example]) => ({
    id, group, symbol, cue, mouth, tip, mistake,
    examples: [example, ...(extras[id] ?? [])].map(([word, transcription, meaning, sentence, translation], index) => ({
      word, transcription, meaning, sentence, translation, audioId: 'ipa-' + id + (index ? '-' + word : ''),
    })),
  })),
)

const soundById = Object.fromEntries(ipaSounds.map(sound => [sound.id, sound]))

export const ipaComparisons = [
  ['long-i', 'short-i', 'sheep', 'ship', 'con cừu', 'con tàu', 'Giữ /iː/ rõ và cao hơn. Với /ɪ/, thả lỏng và hạ lưỡi nhẹ.'],
  ['ash', 'e', 'bat', 'bet', 'con dơi', 'vụ cá cược', 'Mở hàm rộng và hạ lưỡi hơn ở /æ/.'],
  ['s', 'sh', 'sip', 'ship', 'nhấp một ngụm', 'con tàu', 'Với /ʃ/, lùi lưỡi và hơi tròn môi.'],
  ['ch', 'sh', 'chip', 'ship', 'miếng khoai chiên', 'con tàu', 'Nghe phần bật trước tiếng xì trong /tʃ/.'],
  ['th-air', 't', 'thin', 'tin', 'mỏng', 'hộp thiếc', 'Giữ hơi liên tục ở /θ/, còn /t/ chặn rồi bật.'],
  ['th-voice', 'd', 'then', 'den', 'sau đó', 'hang thú', 'Cả hai cùng có rung cổ. Với /ð/, giữ một khe nhỏ để hơi thoát qua răng.'],
].map(([left, right, first, second, firstMeaning, secondMeaning, tip], index) => ({
  left: soundById[left].symbol, right: soundById[right].symbol, tip,
  examples: [
    { word: first, meaning: firstMeaning, audioId: 'compare-' + (index + 1) + '-left' },
    { word: second, meaning: secondMeaning, audioId: 'compare-' + (index + 1) + '-right' },
  ],
}))

type Exercise = readonly ['hear' | 'word' | 'contrast' | 'match', string, string, string, number]
const exercises: Record<Group, Exercise[]> = {
  vowels: [['hear', 'long-i', 'short-i', 'e', 1], ['word', 'ash', 'e', 'uh', 2], ['contrast', 'short-i', 'long-i', 'short-u', 0], ['match', 'short-u', 'oo', 'lot', 1]],
  glides: [['hear', 'ay', 'eye', 'ow', 0], ['word', 'oy', 'ay', 'oh', 1], ['contrast', 'ow', 'oh', 'eye', 2], ['match', 'air', 'ear', 'oor', 0]],
  consonants: [['hear', 'th-air', 't', 'th-voice', 2], ['word', 's', 'sh', 'ch', 1], ['contrast', 'ch', 'sh', 's', 2], ['match', 'th-voice', 'd', 'th-air', 0]],
}

export const ipaLessons = soundGroups.map(group => ({
  ...group, completionId: 'ipa-' + group.id,
  questions: exercises[group.id].map(([type, id, a, b, answer], index) => {
    const key = soundById[id]
    const example = key.examples[0]
    const choices = [soundById[a], soundById[b]]
    choices.splice(answer, 0, key)
    const wordOptions = type === 'word' || type === 'match'
    const spoken = type === 'hear' || type === 'contrast'
    const symbol = (value: string) => '/' + value + '/'
    const prompt = type === 'hear' ? 'Nghe từ mẫu. Bạn nhận ra âm nào?' :
      type === 'contrast' ? 'Nghe kỹ và phân biệt âm mục tiêu.' :
        type === 'word' ? 'Từ nào có âm ' + symbol(key.symbol) + '?' : 'Ghép ký hiệu ' + symbol(example.transcription) + ' với từ đúng.'
    return beginnerQuestion('ipa-' + group.id + '-' + (index + 1), 'ipa', 'IPA · ' + group.name, prompt,
      choices.map(choice => wordOptions ? choice.examples[0].word : symbol(choice.symbol)), answer,
      {
        translation: example.sentence + ' → ' + example.translation,
        words: [[example.word, example.meaning]],
        concept: 'Nhận ra âm ' + symbol(key.symbol) + ' trong một từ',
        simple: example.word + ' đọc là ' + symbol(example.transcription) + '. ' + key.cue + ' ' + key.mouth,
        example: example.word + ' → ' + example.meaning + '. Hãy đọc riêng từ này rồi nối vào câu.',
      },
      choices.map(choice => choice === key ? 'Từ mẫu chứa ' + symbol(key.symbol) + '.' :
        'Từ ' + choice.examples[0].word + ' có âm mục tiêu ' + symbol(choice.symbol) + ' trong nhóm so sánh.'),
      key.tip,
      spoken ? { text: example.word, audioId: example.audioId, keywords: [example.word] } : undefined,
    )
  }),
}))
export const ipaQuestions = ipaLessons.flatMap(lesson => lesson.questions)
export type IpaSound = typeof ipaSounds[number]
