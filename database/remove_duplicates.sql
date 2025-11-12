-- Find duplicate trips (same departure time, stations, duration, distance)
SELECT 
    Departure, 
    [Return], 
    Departure_station_id, 
    Return_station_id, 
    Duration_sec, 
    Covered_distance_m,
    COUNT(*) as DuplicateCount,
    STRING_AGG(CAST(Id AS VARCHAR), ', ') as IDs
FROM [dbo].[BiketripsMay2021]
GROUP BY 
    Departure, 
    [Return], 
    Departure_station_id, 
    Return_station_id, 
    Duration_sec, 
    Covered_distance_m
HAVING COUNT(*) > 1
ORDER BY DuplicateCount DESC;

-- Delete duplicates, keeping only the one with the lowest ID
WITH CTE AS (
    SELECT 
        Id,
        ROW_NUMBER() OVER (
            PARTITION BY 
                Departure, 
                [Return], 
                Departure_station_id, 
                Return_station_id, 
                Duration_sec, 
                Covered_distance_m
            ORDER BY Id
        ) AS RowNum
    FROM [dbo].[BiketripsMay2021]
)
DELETE FROM CTE WHERE RowNum > 1;

-- Verify - check total count after deletion
SELECT COUNT(*) as TotalTripsAfterCleanup FROM [dbo].[BiketripsMay2021];
