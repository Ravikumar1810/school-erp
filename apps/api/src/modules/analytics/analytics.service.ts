import {
  Inject,
  Injectable,
} from "@nestjs/common";
import {
  eq,
} from "drizzle-orm";

import {
  DATABASE_CONNECTION,
} from "../../database/database.constants";

import {
  users,
} from "../../database/schema/user.schema";
import {
  students,
} from "../../database/schema/student.schema";
import {
  attendance,
} from "../../database/schema/attendance.schema";
import {
  marks,
} from "../../database/schema/mark.schema";

import { UserRole } from "../../common/enums/user-role.enum";

type Database = any;

interface StudentAnalyticsRecord {
  id: string;
  className: string;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async getSuperAdminAnalytics() {
    const studentRecords: StudentAnalyticsRecord[] =
  await this.db
    .select({
      id: students.id,
      className: students.className,
    })
    .from(students);

const teacherRecords =
  await this.db
    .select({
      id: users.id,
    })
    .from(users)
    .where(
      eq(
        users.role,
        UserRole.ADMIN,
      ),
    );

    const attendanceRecords =
      await this.db
        .select()
        .from(attendance);

    const markRecords =
      await this.db
        .select()
        .from(marks);

    // ==========================================
    // ATTENDANCE SUMMARY
    // ==========================================

    const presentCount =
      attendanceRecords.filter(
        (record: any) =>
          record.status ===
          "PRESENT",
      ).length;

    const absentCount =
      attendanceRecords.filter(
        (record: any) =>
          record.status ===
          "ABSENT",
      ).length;

    const leaveCount =
      attendanceRecords.filter(
        (record: any) =>
          record.status ===
          "LEAVE",
      ).length;

    const totalAttendance =
      attendanceRecords.length;

    const attendanceRate =
      totalAttendance > 0
        ? Number(
            (
              ((presentCount +
                leaveCount) /
                totalAttendance) *
              100
            ).toFixed(1),
          )
        : 0;

    // ==========================================
    // MARKS / PERFORMANCE
    //
    // IMPORTANT:
    // Your working marks schema may use:
    // obtainedMarks + maxMarks
    //
    // instead of:
    // marksObtained + totalMarks
    //
    // The helper methods below support both.
    // ==========================================

    const normalizedMarks =
      markRecords.map(
        (mark: any) => {
          const obtained =
            Number(
              mark.marksObtained ??
                mark.obtainedMarks ??
                mark.marks ??
                mark.score ??
                0,
            );

          const total =
            Number(
              mark.totalMarks ??
                mark.maxMarks ??
                mark.maximumMarks ??
                100,
            );

          const percentage =
            total > 0
              ? Number(
                  (
                    (obtained /
                      total) *
                    100
                  ).toFixed(1),
                )
              : 0;

          return {
            ...mark,
            obtained,
            total,
            percentage,
          };
        },
      );

    const averagePerformance =
      normalizedMarks.length > 0
        ? Number(
            (
              normalizedMarks.reduce(
                (
                  sum: number,
                  mark: any,
                ) =>
                  sum +
                  mark.percentage,
                0,
              ) /
              normalizedMarks.length
            ).toFixed(1),
          )
        : 0;

    // ==========================================
    // SUBJECT PERFORMANCE
    // ==========================================

    const subjectMap =
      new Map<
        string,
        {
          totalPercentage: number;
          records: number;
        }
      >();

    for (
      const mark of normalizedMarks
    ) {
      const subject =
        String(
          mark.subject ??
            "Unknown",
        );

      const existing =
        subjectMap.get(
          subject,
        ) ?? {
          totalPercentage: 0,
          records: 0,
        };

      existing.totalPercentage +=
        mark.percentage;

      existing.records += 1;

      subjectMap.set(
        subject,
        existing,
      );
    }

    const subjectPerformance =
      Array.from(
        subjectMap.entries(),
      )
        .map(
          ([
            subject,
            value,
          ]) => ({
            subject,

            average:
              value.records > 0
                ? Number(
                    (
                      value.totalPercentage /
                      value.records
                    ).toFixed(1),
                  )
                : 0,
          }),
        )
        .sort(
          (a, b) =>
            b.average -
            a.average,
        );

    // ==========================================
    // CLASS PERFORMANCE
    // ==========================================

    const studentById =
    new Map<string, StudentAnalyticsRecord>(
        studentRecords.map(
        (student) => [
            student.id,
            student,
        ],
        ),
    );

    const classMap =
    new Map<
        string,
        {
        totalPercentage: number;
        records: number;
        }
    >();

    for (const mark of normalizedMarks) {
    const student =
        studentById.get(
        mark.studentId,
        );

    if (!student) {
        continue;
    }

    const className =
        student.className ||
        "Unknown";

    const existing =
        classMap.get(
        className,
        ) ?? {
        totalPercentage: 0,
        records: 0,
        };

    existing.totalPercentage +=
        mark.percentage;

    existing.records += 1;

    classMap.set(
        className,
        existing,
    );
    }

    const classPerformance =
      Array.from(
        classMap.entries(),
      )
        .map(
          ([
            className,
            value,
          ]) => ({
            className,

            average:
              value.records > 0
                ? Number(
                    (
                      value.totalPercentage /
                      value.records
                    ).toFixed(1),
                  )
                : 0,
          }),
        )
        .sort(
          (a, b) =>
            b.average -
            a.average,
        );

    // ==========================================
    // ATTENDANCE TREND
    // ==========================================

    const attendanceTrendMap =
      new Map<
        string,
        {
          present: number;
          absent: number;
          leave: number;
        }
      >();

    for (
      const record of attendanceRecords
    ) {
      const rawDate =
        record.date ??
        record.attendanceDate ??
        record.createdAt;

      if (!rawDate) {
        continue;
      }

      const date =
        new Date(rawDate)
          .toISOString()
          .split("T")[0];

      const existing =
        attendanceTrendMap.get(
          date,
        ) ?? {
          present: 0,
          absent: 0,
          leave: 0,
        };

      if (
        record.status ===
        "PRESENT"
      ) {
        existing.present += 1;
      }

      if (
        record.status ===
        "ABSENT"
      ) {
        existing.absent += 1;
      }

      if (
        record.status ===
        "LEAVE"
      ) {
        existing.leave += 1;
      }

      attendanceTrendMap.set(
        date,
        existing,
      );
    }

    const attendanceTrend =
      Array.from(
        attendanceTrendMap.entries(),
      )
        .map(
          ([
            date,
            values,
          ]) => ({
            date,
            ...values,
          }),
        )
        .sort(
          (a, b) =>
            a.date.localeCompare(
              b.date,
            ),
        )
        .slice(-10);

    return {
      summary: {
        totalStudents:
          studentRecords.length,

        totalTeachers:
          teacherRecords.length,

        attendanceRate,

        averagePerformance,
      },

      attendanceDistribution: {
        present:
          presentCount,

        absent:
          absentCount,

        leave:
          leaveCount,

        total:
          totalAttendance,
      },

      attendanceTrend,

      subjectPerformance,

      classPerformance,
    };
  }
}