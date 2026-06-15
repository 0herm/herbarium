pub fn difficulty(s: &str) -> askama::Result<String> {
    Ok(match s {
        "easy" => "Lett",
        "medium" => "Middels",
        "hard" => "Vanskelig",
        other => return Ok(other.to_string()),
    }.to_string())
}

pub fn time_short(minutes: &u32) -> askama::Result<String> {
    let h = minutes / 60;
    let m = minutes % 60;
    let mut parts = Vec::new();
    if h > 0 { parts.push(format!("{}t", h)); }
    if m > 0 { parts.push(format!("{}min", m)); }
    Ok(if parts.is_empty() { "-".to_string() } else { parts.join(" ") })
}

pub fn time_long(minutes: &u32) -> askama::Result<String> {
    let h = minutes / 60;
    let m = minutes % 60;
    let mut parts = Vec::new();
    if h > 0 {
        parts.push(if h == 1 { format!("{} time", h) } else { format!("{} timer", h) });
    }
    if m > 0 {
        parts.push(if m == 1 { format!("{} minutt", m) } else { format!("{} minutter", m) });
    }
    Ok(if parts.is_empty() { "-".to_string() } else { parts.join(" ") })
}

pub fn format_date(s: &str) -> askama::Result<String> {
    use chrono::{Datelike, NaiveDate};
    const MONTHS: [&str; 12] = ["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"];
    let date = s.get(..10).unwrap_or(s);
    let Ok(d) = NaiveDate::parse_from_str(date, "%Y-%m-%d") else { return Ok(s.to_string()) };
    Ok(format!("{}. {} {}", d.day(), MONTHS[d.month0() as usize], d.year()))
}

pub fn is_new(date_str: &str) -> askama::Result<bool> {
    use chrono::{Local, NaiveDate};
    let date = date_str.get(..10).unwrap_or(date_str);
    let Ok(d) = NaiveDate::parse_from_str(date, "%Y-%m-%d") else { return Ok(false) };
    Ok((Local::now().date_naive() - d).num_days() < 30)
}
