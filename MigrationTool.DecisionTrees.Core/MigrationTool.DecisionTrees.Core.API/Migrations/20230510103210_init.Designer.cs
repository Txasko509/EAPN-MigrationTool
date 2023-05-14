﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MigrationTool.DecisionTrees.Core.Repositories.Context;

#nullable disable

namespace MigrationTool.DecisionTrees.Core.API.Migrations
{
    [DbContext(typeof(AdminDbContext))]
    [Migration("20230510103210_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Choice", b =>
                {
                    b.Property<int>("ChoiceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ChoiceId");

                    b.Property<int?>("GotoItemId")
                        .HasColumnType("int")
                        .HasColumnName("GotoItemId");

                    b.Property<int?>("ItemId")
                        .HasColumnType("int")
                        .HasColumnName("ItemId");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(150)")
                        .HasColumnName("Text");

                    b.HasKey("ChoiceId");

                    b.HasIndex("ItemId");

                    b.ToTable("Choice");
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.DecisionTree", b =>
                {
                    b.Property<int>("DecisionTreeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("DecisionTreeId");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("Description");

                    b.HasKey("DecisionTreeId");

                    b.ToTable("DecisionTree");
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Item", b =>
                {
                    b.Property<int>("ItemId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasColumnName("ItemId");

                    b.Property<int>("DecisionTreeId")
                        .HasColumnType("int")
                        .HasColumnName("DecisionTreeId");

                    b.Property<string>("Subtext")
                        .HasColumnType("nvarchar(1000)")
                        .HasColumnName("Subtext");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("Text");

                    b.HasKey("ItemId");

                    b.HasIndex("DecisionTreeId");

                    b.ToTable("Item");

                    b.UseTptMappingStrategy();
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Answer", b =>
                {
                    b.HasBaseType("MigrationTool.DecisionTrees.Core.Repositories.Model.Item");

                    b.Property<string>("Info")
                        .HasColumnType("nvarchar(1000)")
                        .HasColumnName("Info");

                    b.Property<string>("TextLink")
                        .HasColumnType("nvarchar(500)")
                        .HasColumnName("TextLink");

                    b.ToTable("Answer", (string)null);
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Question", b =>
                {
                    b.HasBaseType("MigrationTool.DecisionTrees.Core.Repositories.Model.Item");

                    b.ToTable("Question", (string)null);
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Choice", b =>
                {
                    b.HasOne("MigrationTool.DecisionTrees.Core.Repositories.Model.Question", null)
                        .WithMany("Choices")
                        .HasForeignKey("ItemId");
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Item", b =>
                {
                    b.HasOne("MigrationTool.DecisionTrees.Core.Repositories.Model.DecisionTree", null)
                        .WithMany("Items")
                        .HasForeignKey("DecisionTreeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Answer", b =>
                {
                    b.HasOne("MigrationTool.DecisionTrees.Core.Repositories.Model.Item", null)
                        .WithOne()
                        .HasForeignKey("MigrationTool.DecisionTrees.Core.Repositories.Model.Answer", "ItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Question", b =>
                {
                    b.HasOne("MigrationTool.DecisionTrees.Core.Repositories.Model.Item", null)
                        .WithOne()
                        .HasForeignKey("MigrationTool.DecisionTrees.Core.Repositories.Model.Question", "ItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.DecisionTree", b =>
                {
                    b.Navigation("Items");
                });

            modelBuilder.Entity("MigrationTool.DecisionTrees.Core.Repositories.Model.Question", b =>
                {
                    b.Navigation("Choices");
                });
#pragma warning restore 612, 618
        }
    }
}
