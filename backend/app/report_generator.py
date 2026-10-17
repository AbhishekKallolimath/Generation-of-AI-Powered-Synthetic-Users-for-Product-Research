
from io import BytesIO
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def generate_research_report(report_data: dict) -> BytesIO:
    """Generate a downloadable PDF research report."""

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="Synthetic User Research Report",
        author="AI Powered Synthetic Users for Product Research",
    )

    styles = getSampleStyleSheet()

    styles.add(
        ParagraphStyle(
            name="ReportTitle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1D4ED8"),
            spaceAfter=18,
        )
    )

    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            parent=styles["Heading2"],
            textColor=colors.HexColor("#1D4ED8"),
            spaceBefore=12,
            spaceAfter=8,
        )
    )

    story = []

    def safe_text(value):
        return escape(str(value if value is not None else "N/A"))

    def add_paragraph(text, style="BodyText"):
        story.append(Paragraph(text, styles[style]))
        story.append(Spacer(1, 8))

    def add_bullet_list(items):
        if not items:
            add_paragraph("No data available.")
            return

        for item in items:
            add_paragraph(f"&bull; {safe_text(item)}")

    # Report title and project information
    story.append(
        Paragraph("Synthetic User Research Report", styles["ReportTitle"])
    )

    product = safe_text(report_data.get("product", "Not specified"))

    add_paragraph(f"<b>Product:</b> {product}")
    add_paragraph(
        "<b>Project:</b> Generation of AI Powered Synthetic Users "
        "for Product Research"
    )
    add_paragraph(
        "<b>Report type:</b> AI-generated synthetic research analysis"
    )

    # Persona profiles
    story.append(
        Paragraph("1. Persona Profiles", styles["SectionHeading"])
    )

    personas = report_data.get("personas", [])

    if personas:
        for persona in personas:
            if not isinstance(persona, dict):
                add_paragraph(safe_text(persona))
                continue

            name = safe_text(
                persona.get("name", persona.get("persona_name", "Unnamed"))
            )
            occupation = safe_text(persona.get("occupation", "N/A"))
            age = safe_text(persona.get("age", "N/A"))

            add_paragraph(
                f"<b>{name}</b><br/>"
                f"Occupation: {occupation}<br/>"
                f"Age: {age}"
            )
    else:
        add_paragraph("No persona profiles were supplied.")

    # Research responses
    story.append(
        Paragraph("2. Research Response Highlights", styles["SectionHeading"])
    )

    responses = report_data.get("responses", [])

    if responses:
        for item in responses:
            if not isinstance(item, dict):
                add_paragraph(safe_text(item))
                continue

            name = safe_text(
                item.get("persona_name", item.get("name", "Participant"))
            )
            response_text = safe_text(
                item.get("response", item.get("answer", ""))
            )

            add_paragraph(f"<b>{name}:</b> {response_text}")
    else:
        add_paragraph("No research responses were supplied.")

    # Insights
    insights = report_data.get("insights", {})

    story.append(
        Paragraph("3. Recurring Themes", styles["SectionHeading"])
    )

    themes = insights.get("themes", [])

    if themes:
        for theme in themes:
            if isinstance(theme, dict):
                name = safe_text(theme.get("name", "Unnamed theme"))
                description = safe_text(theme.get("description", ""))
                mentions = safe_text(theme.get("mentions", "N/A"))

                add_paragraph(
                    f"<b>{name}</b> ({mentions} mentions)<br/>"
                    f"{description}"
                )
            else:
                add_paragraph(safe_text(theme))
    else:
        add_paragraph("No themes available.")

    # Key quotes
    story.append(
        Paragraph("4. Key Persona Quotes", styles["SectionHeading"])
    )

    quotes = insights.get("key_quotes", [])

    if quotes:
        for quote in quotes:
            if isinstance(quote, dict):
                name = safe_text(quote.get("persona_name", "Participant"))
                text = safe_text(quote.get("quote", ""))
                theme = safe_text(quote.get("theme", "N/A"))

                add_paragraph(
                    f"<b>{name}</b><br/>"
                    f"&ldquo;{text}&rdquo;<br/>"
                    f"<i>Theme: {theme}</i>"
                )
    else:
        add_paragraph("No key quotes available.")

    # Sentiment breakdown
    story.append(
        Paragraph("5. Sentiment Breakdown", styles["SectionHeading"])
    )

    sentiment = insights.get("sentiment", {})

    sentiment_data = [
        ["Sentiment", "Response Count"],
        ["Positive", str(sentiment.get("positive", 0))],
        ["Neutral", str(sentiment.get("neutral", 0))],
        ["Negative", str(sentiment.get("negative", 0))],
    ]

    table = Table(sentiment_data, colWidths=[7 * cm, 7 * cm])

    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1D4ED8")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("PADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story.append(table)
    story.append(Spacer(1, 12))

    # Additional analysis
    story.append(
        Paragraph("6. Agreement Patterns", styles["SectionHeading"])
    )
    add_bullet_list(insights.get("agreement_patterns", []))

    story.append(
        Paragraph("7. Behavioral Trends", styles["SectionHeading"])
    )
    add_bullet_list(insights.get("behavioral_trends", []))

    # Product validation score
    story.append(
        Paragraph("8. Product Validation", styles["SectionHeading"])
    )

    score = insights.get("would_use_score", 0)
    add_paragraph(f"<b>AI-estimated interest score: {safe_text(score)}%</b>")

    add_paragraph("<b>Reasoning and limitations:</b>")
    add_bullet_list(insights.get("would_use_reasoning", []))

    add_paragraph(
        "<b>Research limitation:</b> These findings are based on "
        "the supplied synthetic research responses. They do not establish "
        "actual customer demand or replace research with real users."
    )

    document.build(story)
    buffer.seek(0)

    return buffer
