NAV BAR SPECS


nav-bar container:
x369px;y80px;w792px;h40px

36px rounded corners

Fill color = 253541
Stroke color = 30% tint of #253541 (use hex #9ba1a6); 3px stroke weight; do not use rgba transparency


____________________________________________________________

bureau logos:
x386px;y89px;w82px;h25px; fit to width, center vertically:

\\wsl$\Ubuntu\home\avid_arrajeedavey\vioverse-refactor\assets\bureaus\EQ_White_Logo.png
\\wsl$\Ubuntu\home\avid_arrajeedavey\vioverse-refactor\assets\bureaus\EX_White_Logo.svg
\\wsl$\Ubuntu\home\avid_arrajeedavey\vioverse-refactor\assets\bureaus\TU_White_Logo.svg

____________________________________________________________

bureau logo arrows:
Lucide icons used for all arrows: circle-chevron-left (←), circle-chevron-right (→)  
Left arrow: x=467px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (use hex #9ba1a6); do not use rgba transparency  
Right arrow: x=489px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (use hex #9ba1a6); do not use rgba transparency

____________________________________________________________

spacer1:

Divider line: x=520px; y=90px; height=18px; color = 30% tint of #253541 (use hex #9ba1a6); do not use rgba transparency


____________________________________________________________


report section:

Text box container is x537px;y93;w134px;h17px;

Static label text ("report:") should use 30% tint of #253541 (hex #9ba1a6); font: Space Grotesk Bold, 14pt, all lowercase. Only the label word and trailing space should use the tint — not the dynamic date that follows.

in the same text box is the variable credit report date, e.g. "04-25-2024"
color of variable type is white; use Space Grotesk Bold; 14pt; format: [MM]-[DD]-[YYYY]

report arrows:
Lucide icons used for all arrows: circle-chevron-left (←), circle-chevron-right (→)  
Left arrow: x=674px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (use hex #9ba1a6); do not use rgba transparency  
Right arrow: x=696px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (use hex #9ba1a6); do not use rgba transparency


____________________________________________________________

spacer2:

Divider line: x=728px; y=90px; height=18px; color = 30% tint of #253541 (use hex #9ba1a6); do not use rgba transparency


____________________________________________________________


creditor section:

Text box container is x744px;y93;w150px;h17px;

Static label text ("creditor:") should use 30% tint of #253541 (hex #9ba1a6); font: Space Grotesk Bold, 14pt, all lowercase. Only the label word and trailing space should use the tint — not the dynamic creditor name that follows.


The variable creditor name (e.g., "ally financial") appears in the same text box. If the text exceeds the container width, it should be trimmed or truncated to prevent overflow.

Variable text should be white; set in Space Grotesk Bold, 14pt.

creditor arrows:
Lucide icons used for all arrows: circle-chevron-left (←), circle-chevron-right (→)  
Left arrow: x=898px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (hex #9ba1a6); do not use rgba transparency  
Right arrow: x=920px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (hex #9ba1a6); do not use rgba transparency

____________________________________________________________

spacer3:

Divider line: x=952px; y=90px; height=18px; color = 30% tint of #253541 (hex #9ba1a6); do not use rgba transparency


____________________________________________________________


page-nu section:

Text box container is x969px;y93;w62px;h17px; 

Static label text ("page:") should use 30% tint of #253541 (hex #9ba1a6); font: Space Grotesk Bold, 14pt, all lowercase. Only the label word and trailing space should use the tint — not the dynamic page number that follows.

The variable page number (e.g., "57") appears in the same text box and should be styled in white using Space Grotesk Bold, 14pt.

IMPORTANT: Some creditors have more than one PNG page in a single bureau report (e.g., AL-EQ-2024-04-25-P57.png and AL-EQ-2024-04-25-P58.png). In these cases, the text container should expand to fit the full label, such as: "pages: 57–58". The currently active page number should be styled in white, while the additional page(s) should use a 30% tint of #253541 (hex #9ba1a6). If the container expands, the left and right arrow icons must shift accordingly to maintain proper horizontal alignment.

page arrows:
Lucide icons used for all arrows: circle-chevron-left (←), circle-chevron-right (→)  
Left arrow: x=1033px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (hex #9ba1a6); do not use rgba transparency  
Right arrow: x=1055px; y=90px; width=17px; height=17px; color = 30% tint of #253541 (hex #9ba1a6); do not use rgba transparency


INTERACTIVITY – HOVER STATES

• On hover, all up and down arrow icons in the nav bar should change to solid color #f26419 (100% opacity)
• This applies to both Lucide icons: `circle-chevron-up` and `circle-arrow-down`
• No animation or transition needed unless specified later



