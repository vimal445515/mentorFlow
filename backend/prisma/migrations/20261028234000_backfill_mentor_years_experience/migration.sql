WITH experience_ranges AS (
    SELECT
        "mentorId",
        range_agg(
            daterange(
                "startDate"::date,
                GREATEST(
                    LEAST(
                        CASE
                            WHEN "isCurrent" OR "endDate" IS NULL THEN CURRENT_DATE
                            ELSE "endDate"::date
                        END,
                        CURRENT_DATE
                    ),
                    "startDate"::date
                ) + 1,
                '[)'
            )
        ) AS ranges
    FROM "mentorExperience"
    WHERE "startDate"::date <= CURRENT_DATE
      AND (
          "isCurrent"
          OR "endDate" IS NULL
          OR "endDate"::date >= "startDate"::date
      )
    GROUP BY "mentorId"
),
experience_totals AS (
    SELECT
        "mentorId",
        FLOOR(
            SUM(UPPER(merged.range) - LOWER(merged.range))::numeric / 365
        )::integer AS "yearsExperience"
    FROM experience_ranges
    CROSS JOIN LATERAL unnest(experience_ranges.ranges) AS merged(range)
    GROUP BY "mentorId"
)
UPDATE "mentorProfile" AS profile
SET "yearsExperience" = COALESCE(
    (
        SELECT totals."yearsExperience"
        FROM experience_totals AS totals
        WHERE totals."mentorId" = profile."mentorId"
    ),
    0
);
