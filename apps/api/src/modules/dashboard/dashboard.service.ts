import {
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  and,
  count,
  eq,
  sql,
} from "drizzle-orm";

import { DATABASE_CONNECTION } from "../../database/database.constants";

import { users } from "../../database/schema/user.schema";
import { students } from "../../database/schema/student.schema";
import { attendance } from "../../database/schema/attendance.schema";
import { marks } from "../../database/schema/mark.schema";
import { UserRole } from "../../common/enums/user-role.enum";

type Database = any;

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  // =========================================================
  // SUPER ADMIN / PRINCIPAL DASHBOARD
  // =========================================================

  async getSuperAdminDashboard() {
    const [studentCountResult] = await this.db
      .select({
        count: count(),
      })
      .from(students);

    const [teacherCountResult] = await this.db
      .select({
        count: count(),
      })
      .from(users)
      .where(eq(users.role, UserRole.ADMIN));

    const attendanceRecords = await this.db
      .select({
        status: attendance.status,
      })
      .from(attendance);

    const totalAttendanceRecords =
      attendanceRecords.length;

    const presentRecords =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status === "PRESENT",
      ).length;

    const LeaveRecords =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status === "LEAVE",
      ).length;

    const absentRecords =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status === "ABSENT",
      ).length;

    const attendanceRate =
      totalAttendanceRecords > 0
        ? Number(
            (
              ((presentRecords + LeaveRecords) /
                totalAttendanceRecords) *
              100
            ).toFixed(1),
          )
        : 0;

    const markRecords = await this.db
      .select({
        marksObtained:
          marks.marksObtained,
        totalMarks:
          marks.maximumMarks,
      })
      .from(marks);

    let totalPercentage = 0;
    let validMarkRecords = 0;

    for (const mark of markRecords) {
      const obtained = Number(
        mark.marksObtained,
      );

      const total = Number(
        mark.totalMarks,
      );

      if (
        !Number.isNaN(obtained) &&
        !Number.isNaN(total) &&
        total > 0
      ) {
        totalPercentage +=
          (obtained / total) * 100;

        validMarkRecords++;
      }
    }

    const averagePerformance =
      validMarkRecords > 0
        ? Number(
            (
              totalPercentage /
              validMarkRecords
            ).toFixed(1),
          )
        : 0;

    return {
      stats: {
        totalStudents: Number(
          studentCountResult?.count ??
            0,
        ),

        totalTeachers: Number(
          teacherCountResult?.count ??
            0,
        ),

        attendanceRate,

        averagePerformance,
      },

      attendanceOverview: {
        total:
          totalAttendanceRecords,

        present:
          presentRecords,

        absent:
          absentRecords,

        leave:
          LeaveRecords,

        attendanceRate,
      },

      marksOverview: {
        totalRecords:
          markRecords.length,

        averagePerformance,
      },
    };
  }

  // =========================================================
  // ADMIN / TEACHER DASHBOARD
  // =========================================================

  async getAdminDashboard() {
    const [studentCountResult] =
      await this.db
        .select({
          count: count(),
        })
        .from(students);

    const attendanceRecords =
      await this.db
        .select({
          status:
            attendance.status,
        })
        .from(attendance);

    const totalAttendance =
      attendanceRecords.length;

    const presentCount =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status ===
          "PRESENT",
      ).length;

    const leaveCount = attendanceRecords.filter(
    (record) => record.status === "LEAVE",
    ).length;

    const absentCount =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status ===
          "ABSENT",
      ).length;

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

    const markRecords =
      await this.db
        .select({
          marksObtained:
            marks.marksObtained,

          totalMarks:
            marks.maximumMarks,
        })
        .from(marks);

    let totalPercentage = 0;
    let validRecords = 0;

    for (const mark of markRecords) {
      const obtained = Number(
        mark.marksObtained,
      );

      const total = Number(
        mark.totalMarks,
      );

      if (
        !Number.isNaN(obtained) &&
        !Number.isNaN(total) &&
        total > 0
      ) {
        totalPercentage +=
          (obtained / total) *
          100;

        validRecords++;
      }
    }

    const averagePerformance =
      validRecords > 0
        ? Number(
            (
              totalPercentage /
              validRecords
            ).toFixed(1),
          )
        : 0;

    return {
      stats: {
        totalStudents: Number(
          studentCountResult?.count ??
            0,
        ),

        attendanceRate,

        averagePerformance,

        totalMarkRecords:
          markRecords.length,
      },

      attendanceOverview: {
        total:
          totalAttendance,

        present:
          presentCount,

        absent:
          absentCount,

        leave:
          leaveCount,
      },
    };
  }

  // =========================================================
  // STUDENT DASHBOARD
  // =========================================================

  async getStudentDashboard(
    userId: string,
  ) {
    const [student] =
      await this.db
        .select()
        .from(students)
        .where(
          eq(
            students.userId,
            userId,
          ),
        )
        .limit(1);

    if (!student) {
      throw new NotFoundException(
        "Student profile not found.",
      );
    }

    const attendanceRecords =
      await this.db
        .select({
          status:
            attendance.status,
        })
        .from(attendance)
        .where(
          eq(
            attendance.studentId,
            student.id,
          ),
        );

    const totalAttendance =
      attendanceRecords.length;

    const presentCount =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status ===
          "PRESENT",
      ).length;

    const leaveCount =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status ===
          "LEAVE",
      ).length;

    const absentCount =
      attendanceRecords.filter(
        (record: { status: string }) =>
          record.status ===
          "ABSENT",
      ).length;

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

    const studentMarks =
      await this.db
        .select({
          subject:
            marks.subject,

          marksObtained:
            marks.marksObtained,

          totalMarks:
            marks.maximumMarks,
        })
        .from(marks)
        .where(
          eq(
            marks.studentId,
            student.id,
          ),
        );

    let totalPercentage = 0;
    let validRecords = 0;

    const subjectPerformance =
      studentMarks.map(
        (mark: {
          subject: string;
          marksObtained: number;
          totalMarks: number;
        }) => {
          const obtained =
            Number(
              mark.marksObtained,
            );

          const total =
            Number(
              mark.totalMarks,
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

          if (total > 0) {
            totalPercentage +=
              percentage;

            validRecords++;
          }

          return {
            subject:
              mark.subject,

            marksObtained:
              obtained,

            totalMarks:
              total,

            percentage,
          };
        },
      );

    const averagePerformance =
      validRecords > 0
        ? Number(
            (
              totalPercentage /
              validRecords
            ).toFixed(1),
          )
        : 0;

    return {
      student: {
        id:
          student.id,

        name:
          student.name,

        admissionNumber:
          student.admissionNumber,

        className:
          student.className,

        section:
          student.section,

        rollNumber:
          student.rollNumber,
      },

      stats: {
        attendanceRate,

        averagePerformance,

        totalSubjects:
          studentMarks.length,

        totalAttendanceRecords:
          totalAttendance,
      },

      attendanceOverview: {
        present:
          presentCount,

        absent:
          absentCount,

        leave:
          leaveCount,

        total:
          totalAttendance,
      },

      subjectPerformance,
    };
  }
}