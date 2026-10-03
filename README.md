# 24 | עוצרות. מחכות. מחליטות נכון.

אפליקציה קטנה ליישום חוק 24 השעות, מתוך הספר "להיות פשוט עצמאית, פיננסית." של לינוי הדר.

רוצה לקנות משהו שלא תכננת? מכניסות אותו לעגלה, מחכות 24 שעות, ורק אז מחליטות.

**באוויר:** https://24.hafinancit.co.il

## מה יש בה
* טיימר 24 שעות לכל פריט
* יומן השדונים: מה, מתי, איך הרגשתי ואיזה שדון דיבר
* תובנות שבועיות וחודשיות, וכמה כסף נשאר אצלך
* דמות אישית או תמונה שלך

## פרטיות
כל המידע נשמר רק בטלפון (localStorage). אין שרת, אין חשבון ואין מסד נתונים.

## טכני
קובץ HTML אחד עם CSS ו JavaScript, בלי תלויות. עובד כ PWA ואפשר להתקין למסך הבית.
פריסה: `npx vercel deploy --prod`

## אפליקציות בחנויות

הגרסאות לאייפון ולאנדרואיד נבנות בענן של GitHub (לשונית Actions), בלי להתקין כלום במחשב.

| | איך מפעילים | סודות שנדרשים (Settings, Secrets and variables, Actions) |
|---|---|---|
| **iPhone** | Actions, "iOS build and upload", Run workflow. הבנייה עולה ישר ל App Store Connect | `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (מפתח App Store Connect API, הרשאת Admin) |
| **Android** | Actions, "Android build", Run workflow. קובץ ה `.aab` נמצא ב Artifacts של ההרצה, ומעלים אותו ב Google Play Console | `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD` |

### מפתח החתימה לאנדרואיד

המפתח **לא** נמצא במאגר הזה, כי המאגר ציבורי. הוא שמור במחשב בתיקייה `~/Documents/24-app-android-signing`, ויש לגבות אותה במקום פרטי נוסף (iCloud Drive, כונן חיצוני, או המאגר הפרטי `LBS720/app24-signing-backup`).

אם הסודות ב GitHub נמחקו, מריצים מתוך תיקיית הגיבוי:

```bash
gh secret set ANDROID_KEYSTORE_B64 --repo LBS720/app24 < upload-keystore.base64.txt
gh secret set ANDROID_KEYSTORE_PASSWORD --repo LBS720/app24 < password.txt
```

אם המפתח אבד לגמרי: Google Play App Signing מאפשר לבקש איפוס של מפתח ההעלאה, ב Play Console תחת App signing.
