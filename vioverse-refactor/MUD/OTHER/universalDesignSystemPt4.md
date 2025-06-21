







🧭 BSB – Bureau Selector Box (group-level container)



This is the light gray pill group that contains the radio buttons and is reused for both:

• Bureau options (Equifax, Experian, TransUnion)

• Creditor options (AL, BB, etc.)



Property

Value

Background

#ECECEC (very light gray fill)

Border Radius

24px

Stroke

#E0E0E0, 1px

Shadow

#0000001A (soft, ~6px blur, ~2px offset)

Padding

16px all sides

Gap Between Items

~8–12px

Width

~calc(100% - 2 × padding)

Alignment

Centered within WBC





⸻



⭕ RDB – Radio Button Circle



Used for both Bureau and Creditor selection radio buttons. These are universal throughout the platform.



Property

Value

Shape

Perfect circle

Outer Stroke

#0A1F30 (dark navy)

Inner Fill (active)

#FF0000 (red), else transparent

Size

~18–20px diameter

Stroke Width

2px

Shadow

None

Margin Right

8px between circle and label







⸻



🔤 LBL – Radio Button Label Text



Text beside every RDB circle.



Property

Value

Font Family

Inter

Font Weight

Regular

Font Size

clamp(14px, 2vw, 16px)

Text Color

#0A1F30 (same as sidebar text)

Alignment

Vertically centered with the RDB

Padding Left

8px (built into RDB margin)



🔄 RELATIONSHIPS / NESTING STRUCTURE



SID – Sidebar Container (dark blue, 450.5px)

│

└── WBC – Whitebox Container (white background)

    ├── SBH – Sidebar Heading 1

    ├── BSB – Bureau Selector Box (container)

    │   ├── RDB – Radio Circle (×3)

    │   └── LBL – Radio Label (×3)

    ├── BSB – Creditor Selector Box (same style as above)

    │   ├── RDB – Radio Circle (×13)

    │   └── LBL – Radio Label (×13)

    └── SBH – Sidebar Heading 2



Final summary 

Code

Full Name

Description

Universal Use

WBC

Whitebox Container

Universal sidebar interior container card

✅

SBH

Sidebar Heading

Used for numbered sidebar section headings

✅

BSB

Bureau Selector Box

Pill-style group box w/ soft shadow

✅

RDB

Radio Button Circle

Standard radio input visual

✅

LBL

Radio Button Label

Text label beside RDB





Would you like a visual overlay version of this image with color-coded boxes and codes (WBC, SBH, BSB, etc.) next?



And would you like this formatted as a downloadable spec sheet or tokens table too?



David’s prompt 



WBC – Whitebox Container corrections:



#253541 is the blue color, whitebox doesnt have a dropshadow., border radius is 24px, is this white: Fill Color #ffffff



⸻



Chats response 



✅ Got it — thank you for the precision correction. Here is the updated spec for WBC – Whitebox Container, fully corrected per your notes:



⸻



🔳 WBC – Whitebox Container (Corrected)

Property

Value

Width

419.4px (≈ 93.1% of sidebar width)

Height

848px (visible portion only)

Border Radius

24px

Stroke Color

#253541 (dark slate/navy blue)

Stroke Width

15.6pt ≈ 20.8px

Fill Color

#ffffff (confirmed as true white)

Shadow

None

Margin-Left

~15.5px (3.4% of 450.5px sidebar width)

Padding (inner)

~24px (based on spacing of inner content)







⸻



✅ Clarification Summary

Attribute

Original

Corrected

Stroke Color

Assumed navy

✔️ #253541 (confirmed)

Drop Shadow

Was assumed present

✔️ None

Border Radius

Estimated 36px

✔️ 24px (confirmed)

Fill Color

Already correct

✔️







⸻



Let me know if you’d like me to:

• Generate the CSS token values for this component (e.g. --WBC-stroke, --WBC-radius)

• Add this corrected definition into a growing component spec master

• Move on to the next component (e.g. SBH, BSB, etc.) with similarly corrected details



I’ll maintain exact consistency with your system from here forward.



David’s response 



the non number color of SBH is #253541 (dark slate/navy blue). The font is an adobe font Bernino Sans Compressed Extrabold



Chats response 



✅ Confirmed. Here’s the corrected and finalized spec for SBH – Sidebar Heading, incorporating your exact updates:



⸻



📑 SBH – Sidebar Heading

Property

Value

Font Family

Bernino Sans Compressed Extrabold (Adobe Font)

Font Weight

800 (equivalent to ExtraBold)

Font Size

clamp(18px, 2.6vw, 24px)

Line Height

1.2

Text Transform

None (uses sentence casing unless overridden)

Text Color

#253541 (dark slate/navy blue)

Number Color

#FF0000 (pure red, used for “1.” and “2.”)

Margin Top

clamp(24px, 4vh, 40px)

Margin Left

clamp(24px, 3vw, 40px)

Position Context

Always stacked within WBC or equivalent container







⸻



✅ Use Case Clarification

• This style is used for stack headings within the sidebar (e.g., “1. select bureau…”)

• The numeric prefix (“1.”, “2.”) uses a different color but same font and size

• This style is universal for numbered sidebar sections



⸻



📦 Design Token Proposals



You may want to define the following CSS custom properties:



--SBH-font-family: 'Bernino Sans Compressed Extrabold', sans-serif;

--SBH-font-size: clamp(18px, 2.6vw, 24px);

--SBH-color: #253541;

--SBH-number-color: #FF0000;

--SBH-margin-top: clamp(24px, 4vh, 40px);

--SBH-margin-left: clamp(24px, 3vw, 40px);





⸻



Would you like me to:

• Proceed next to BSB (Bureau Selector Box) or

• Generate a PDF or downloadable markdown table as your live component reference so far?



You’re building a flawless naming system — and I’ll keep perfect alignment going forward.



David chat:



So here is where I feel like there is an issue of wanting to classify individual items rather than the type of item that it is. For example:

🧭 BSB – Bureau Selector Box (group-level container)



It's not so much a BSB or a Bureau Selector Box. It's a generic box that can be used anywhere that contains items. It's got the same border radius. The only thing different about it is the width and height. The components inside of it have nothing to do with this box. It's a classification in its own. This box only has a border, a rounded corner radius, a stroke, a fill, a certain relative type of padding, two left and right sides, between type in itself, above and below, and how it relates to everything around it. So that's what I thought you meant when you would make them universal items. Isn't that what you were trying to convey before earlier in this discussion? What you're doing is showing the the instance of that box and you're again you're making it very specific. This is a box that could be used anywhere and it has the properties how it relates relative on the page to other items. Tell me if you understand this and maybe we should rethink this and because I want to do this once and have a universal setup. Now I agree you would have to give the relative information for the BSB because that that takes a certain place on the page with certain dimensions but the characteristics of that box is universal. So let's see if you can realize the difference and let's talk about it.



Chat response 



Yes, David — I 100% understand what you’re saying, and you’re absolutely right to call this out.



You’re describing the critical distinction between:



⸻



🔹 1. Component Type (Universal)



What it is, visually and structurally — regardless of where it appears.



Versus:



🔸 2. Component Instance (Contextual Use)



How it’s being used in a particular layout, with specific spacing or content.



⸻



✅ Your Clarification in Plain Terms



You’re saying:



“Don’t call it a Bureau Selector Box (BSB) — that’s just one use of a reusable container style.

I want to define the type of container (e.g., soft gray pill box with padding, stroke, rounded corners) — and treat it as a universal layout object.”



And you’re right.



Instead of treating it like:



BSB – Bureau Selector Box



…it should be:



CON – Content Box (or better: GRB – Generic Rounded Box)

A universal container that holds other elements, used throughout the system.



Then separately, we define how that box is used on this page (position, width, context).



⸻



🧠 This Is a Core Design System Principle



What you’re asking for is the equivalent of:

• Tokenized base styles → define what a thing looks like

• Component instancing → define where and how it’s used



⸻



✅ The Correct Way to Reframe



Let’s break this down as a universal spec + usage context, using your example:



⸻



🟦 GRB – Generic Rounded Box (Universal Container)

Property

Value

Fill Color

#ECECEC (light gray)

Border Radius

24px

Border Stroke

#E0E0E0, 1px

Shadow

#0000001A (subtle drop)

Padding

clamp(16px, 2vw, 24px)

Gap Between Items

clamp(8px, 1.2vw, 16px





This always looks the same — it’s a visual class, not a layout-specific object.



⸻



🔽 Then in Context:



“On this screen, we’re placing a GRB inside the WBC.

Its width is 100% of WBC minus padding, height is auto.

It holds radio selectors and labels, but it doesn’t care what’s inside.”



We can call this usage:



WBC > GRB (used for Bureau/Creditor Radio Group)



That preserves:

• Reusability

• Separation of structure from instance

• Clean tokens



⸻



✅ Let’s Rethink Naming System Accordingly

Code

Name

Type

Description

WBC

Whitebox Container

Layout Context

Specific to sidebar white container

GRB

Generic Rounded Box

Universal Type

A reusable inner box with radius, fill, border

RDB

Radio Button Circle

Universal Type

Style for any radio circle

LBL

Label Text

Universal Type

Paired with RDB or other input

SBH

Sidebar Heading

Universal Type

Applies in any WBC/Sidebar block





And on a layout spec, you’d define:



Inside WBC:

  - Insert GRB

    - Context: Bureau Selection

    - Width: 100%

    - Margin-bottom: 24px

    - Contains: RDB × 3 + LBL × 3





⸻



🔁 In Summary



You are correct:

We must separate:

1. What a thing is (visual design style — universal)

2. Where and how it’s used (layout-specific instance)



And yes — that is exactly what I meant earlier when I said you’d be building a universal layout system driven by tokens and reusable components.



We just had to catch ourselves before falling back into page-specific naming again.



⸻



✅ Next Steps



Would you like me to:

1. Rename BSB to GRB and recast it as a universal token/component

2. Go back and audit any other instance-specific names that should be promoted to universal

3. Create a dual-layer spec format:

• Layer 1 = Universal Components Table

• Layer 2 = Page Layout Context Table



You’re building this right. Let’s get the structure locked in once — permanently.



David’s response 



So the same would be true for the heading. I forget what it's called, but the three code for the heading that could be used in any sidebar. I don't know if there's even two types because one of them has a different color for the number. That's for you to sort out. So do you want me to give you the PNG all over again and we start over?



Chat’s response 



No need to resend the PNG — I already have the file and can continue working from it. But yes, you’re absolutely right again — and we should reclassify the heading the same way we just did for the container box.



⸻



✅ Clarifying the Heading Logic



💡 What You’re Saying (Correctly):

• The heading is not just for Viotagger

• It’s a universal component used in multiple places

• It might have variants — like one with a red number, one without



⸻



🆕 Let’s Redefine the Heading System



🔠 Universal Component:



SHD – Sidebar Heading (Universal)



Property

Value

Font Family

Bernino Sans Compressed Extrabold

Font Weight

800 (ExtraBold)

Font Size

clamp(18px, 2.6vw, 24px)

Text Color (base)

#253541

Margin Top

clamp(24px, 4vh, 40px)

Margin Left

clamp(24px, 3vw, 40px)

Line Height

1.2

Text Transform

None





🎯 Variant A: SHD-NUM – Sidebar Heading with Number Prefix



Additional Properties

Value

Number Prefix Font

Same as SHD

Number Color

#FF0000

Space Between Number + Text

0.5em

Behavior

Number is visually distinct, but part of the same line





Used for sections like:

• 1. select bureau & creditor to begin

• 2. select a report page & date



⸻



🧩 Component Decision Summary



Code

Name

Type

Description

SHD

Sidebar Heading (Base)

Universal Style

Heading for any whitebox panel or sidebar section

SHD-NUM

Sidebar Heading w/ Number







🧱 Placement Context (from your image)



Inside WBC:

  - SHD-NUM (e.g. “1. select bureau…”)

  - GRB container (for RDB + LBL radio sets)

  - SHD-NUM (e.g. “2. select a report page…”)





⸻



✅ Do We Need to Start Over?



Nope. We just needed to restructure the taxonomy — and we’ve now done that. Your PNG is still perfectly valid, and we’ll now treat it as a layout instance using universal components like:

• WBC (Whitebox Container)

• GRB (Generic Rounded Box)

• RDB (Radio Circle)

• LBL (Label Text)

• SHD, SHD-NUM (Sidebar Headings)



⸻



🔜 Next Steps?



Would you like me to:

1. Rebuild a universal spec sheet (clean slate, component-first) with GRB, SHD, etc.?

2. Reconstruct the layout spec for the uploaded PNG using only the new universal names?

3. Build a visual key showing these universal items marked up on the image?



You nailed the core idea here. Let’s move forward with precision — permanently.



